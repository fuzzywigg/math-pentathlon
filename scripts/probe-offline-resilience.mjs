/**
 * One-shot Chromium probe: offline-after-first-load + Slow 3G.
 * Writes JSON findings to /opt/cursor/artifacts for the resilience doc.
 *
 * Uses a production `vite preview` build so the Workbox service worker is active
 * (dev mode has no SW unless PWA_DEV=1).
 */
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = '/opt/cursor/artifacts/offline-resilience-probe.json';

const SLOW_3G = {
  offline: false,
  downloadThroughput: Math.floor((500 * 1024) / 8),
  uploadThroughput: Math.floor((500 * 1024) / 8),
  latency: 400,
  connectionType: 'cellular3g',
};

async function getFreePort() {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      if (!address || typeof address === 'string') {
        server.close();
        reject(new Error('Could not allocate port'));
        return;
      }
      const { port } = address;
      server.close((err) => (err ? reject(err) : resolve(port)));
    });
  });
}

async function waitForUrl(url, timeoutMs = 90_000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok || res.status === 404) return;
    } catch {
      // booting
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error(`Timed out waiting for ${url}`);
}

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      cwd: ROOT,
      stdio: ['ignore', 'pipe', 'pipe'],
      env: process.env,
    });
    let err = '';
    child.stderr.on('data', (c) => {
      err += c.toString();
    });
    child.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} ${args.join(' ')} failed (${code}): ${err}`));
    });
  });
}

async function waitForSw(page) {
  await page.waitForFunction(
    async () => {
      if (!('serviceWorker' in navigator)) return false;
      const reg = await navigator.serviceWorker.ready;
      return reg.active?.state === 'activated';
    },
    null,
    { timeout: 60_000 }
  );
  const hasController = await page.evaluate(
    () => navigator.serviceWorker.controller != null
  );
  if (!hasController) {
    await page.reload({ waitUntil: 'load' });
  }
  await page.waitForFunction(
    () => navigator.serviceWorker.controller != null,
    null,
    { timeout: 60_000 }
  );
}

async function collectFailed(page, action) {
  const failed = [];
  const onFail = (req) => {
    failed.push({
      url: req.url(),
      method: req.method(),
      resourceType: req.resourceType(),
      failure: req.failure()?.errorText ?? 'unknown',
    });
  };
  page.on('requestfailed', onFail);
  try {
    await action();
  } finally {
    page.off('requestfailed', onFail);
  }
  return failed;
}

function classify(url) {
  if (/\/fonts\/|\.woff2?(?:\?|$)/i.test(url)) return 'font';
  if (/three|board-3d|vendor\/three/i.test(url)) return '3d-asset';
  if (/game-controller|\.worker|\/games\//i.test(url)) return 'lazy-game-chunk';
  if (/\.js(\?|$)/i.test(url)) return 'js';
  if (/\.css(\?|$)/i.test(url)) return 'css';
  return 'other';
}

async function main() {
  mkdirSync(path.dirname(OUT), { recursive: true });
  const findings = {
    date: '2026-10-07',
    browser: 'chromium',
    scenarios: {},
  };

  console.log('Building production bundle…');
  await run('npm', ['run', 'build']);

  const port = await getFreePort();
  const baseURL = `http://127.0.0.1:${port}`;
  const preview = spawn(
    'npx',
    ['vite', 'preview', '--host', '127.0.0.1', '--port', String(port), '--strictPort'],
    { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'], env: process.env }
  );
  await waitForUrl(baseURL);
  console.log('Preview ready at', baseURL);

  const browser = await chromium.launch();

  // --- Scenario A: offline after first online visit (SW precache) ---
  {
    const context = await browser.newContext();
    const page = await context.newPage();
    const failedOnline = await collectFailed(page, async () => {
      await page.goto(baseURL + '/', { waitUntil: 'networkidle', timeout: 60_000 });
      await waitForSw(page);
      // Warm menu + one game so game chunk is definitely requested while online.
      await page.goto(baseURL + '/#/game/hex', {
        waitUntil: 'networkidle',
        timeout: 60_000,
      });
      await page.waitForSelector('.hex-board, #board, [data-testid="game-load-error"]', {
        timeout: 30_000,
      });
    });

    await context.setOffline(true);
    const offlineNav = {};
    const failedOffline = await collectFailed(page, async () => {
      await page.goto(baseURL + '/#/', { waitUntil: 'domcontentloaded', timeout: 30_000 });
      offlineNav.menuCards = await page.locator('.game-card').count();
      offlineNav.menuVisible = offlineNav.menuCards > 0;
      offlineNav.dataOffline =
        (await page.locator('html[data-offline="true"]').count()) > 0;

      await page.goto(baseURL + '/#/game/hex', {
        waitUntil: 'domcontentloaded',
        timeout: 30_000,
      });
      await page
        .waitForSelector('.hex-board, #board, [data-testid="game-load-error"]', {
          timeout: 20_000,
        })
        .catch(() => null);
      offlineNav.hexBoard = (await page.locator('.hex-board, #board').count()) > 0;
      offlineNav.hexLoadError =
        (await page.locator('[data-testid="game-load-error"]').count()) > 0;
      offlineNav.hexHint = await page
        .locator('[data-testid="game-load-error-hint"]')
        .textContent()
        .catch(() => null);

      // Unvisited 3D-capable game while offline (Pent-em-in) — chunk should be
      // precached by Workbox globPatterns even if never opened online.
      await page.goto(baseURL + '/#/game/pent-em-in', {
        waitUntil: 'domcontentloaded',
        timeout: 30_000,
      });
      await page
        .waitForSelector('.pent-board, #board, [data-testid="game-load-error"]', {
          timeout: 20_000,
        })
        .catch(() => null);
      offlineNav.pentBoard =
        (await page.locator('.pent-board, #board, h1').count()) > 0;
      offlineNav.pentLoadError =
        (await page.locator('[data-testid="game-load-error"]').count()) > 0;

      // Font face check while offline
      offlineNav.fontFaces = await page.evaluate(async () => {
        const faces = [...document.fonts].map((f) => ({
          family: f.family,
          weight: f.weight,
          status: f.status,
        }));
        await document.fonts.ready;
        return {
          faces,
          interReady: [...document.fonts].some(
            (f) => f.family.includes('Inter') && f.status === 'loaded'
          ),
        };
      });
    });

    findings.scenarios.offlineAfterFirstLoad = {
      description:
        'Production preview + SW: first online visit, then context.setOffline(true)',
      failedOnlineSample: failedOnline.slice(0, 10).map((f) => ({
        ...f,
        kind: classify(f.url),
      })),
      failedOffline: failedOffline.map((f) => ({ ...f, kind: classify(f.url) })),
      failedOfflineByKind: failedOffline.reduce((acc, f) => {
        const k = classify(f.url);
        acc[k] = (acc[k] || 0) + 1;
        return acc;
      }, {}),
      offlineNav,
    };
    await context.close();
  }

  // --- Scenario B: Slow 3G cold load + open Hex + open 3D game ---
  {
    const context = await browser.newContext();
    const page = await context.newPage();
    const cdp = await context.newCDPSession(page);
    await cdp.send('Network.enable');
    await cdp.send('Network.emulateNetworkConditions', SLOW_3G);

    const timings = {};
    const failed = [];
    page.on('requestfailed', (req) => {
      failed.push({
        url: req.url(),
        resourceType: req.resourceType(),
        failure: req.failure()?.errorText ?? 'unknown',
        kind: classify(req.url()),
      });
    });

    const t0 = Date.now();
    await page.goto(baseURL + '/', { waitUntil: 'domcontentloaded', timeout: 120_000 });
    await page.waitForSelector('.game-card', { timeout: 120_000 });
    timings.menuDomMs = Date.now() - t0;

    const fontStatus = await page.evaluate(async () => {
      await document.fonts.ready;
      return {
        interLoaded: [...document.fonts].filter((f) => f.family.includes('Inter'))
          .length,
        documentFontsStatus: document.fonts.status,
      };
    });

    const tHex = Date.now();
    await page.goto(baseURL + '/#/game/hex', {
      waitUntil: 'domcontentloaded',
      timeout: 120_000,
    });
    await page
      .waitForSelector('.hex-board, #board, [data-testid="game-load-error"]', {
        timeout: 120_000,
      })
      .catch(() => null);
    timings.hexReadyMs = Date.now() - tHex;
    const hexOk = (await page.locator('.hex-board, #board').count()) > 0;
    const hexErr = (await page.locator('[data-testid="game-load-error"]').count()) > 0;

    const t3d = Date.now();
    await page.goto(baseURL + '/#/game/hex-a-gone', {
      waitUntil: 'domcontentloaded',
      timeout: 120_000,
    });
    await page
      .waitForSelector(
        '.hex-a-gone-board, #board, [data-testid="game-load-error"], canvas[data-mp3d]',
        { timeout: 120_000 }
      )
      .catch(() => null);
    timings.hexAGoneReadyMs = Date.now() - t3d;
    const hagOk =
      (await page.locator('.hex-a-gone-board, #board, canvas[data-mp3d]').count()) >
      0;
    const hagErr =
      (await page.locator('[data-testid="game-load-error"]').count()) > 0;
    const threeRequested = await page.evaluate(() =>
      performance
        .getEntriesByType('resource')
        .some((e) => /three/i.test(e.name))
    );

    findings.scenarios.slow3g = {
      description: 'CDP Network.emulateNetworkConditions Slow 3G (500kbps / 400ms)',
      timings,
      fontStatus,
      hexOk,
      hexErr,
      hagOk,
      hagErr,
      threeRequested,
      failed: failed.slice(0, 30),
      failedByKind: failed.reduce((acc, f) => {
        acc[f.kind] = (acc[f.kind] || 0) + 1;
        return acc;
      }, {}),
    };
    await context.close();
  }

  // --- Scenario C: force chunk abort (simulates flaky network) + retry ---
  {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(baseURL + '/', { waitUntil: 'networkidle', timeout: 60_000 });
    await waitForSw(page);

    let blockHex = true;
    await page.route('**/assets/game-hex-*.js*', async (route) => {
      if (blockHex) {
        await route.abort('failed');
        return;
      }
      await route.continue();
    });

    await page.goto(baseURL + '/#/game/hex', {
      waitUntil: 'domcontentloaded',
      timeout: 30_000,
    });
    await page
      .waitForSelector('[data-testid="game-load-error"], .hex-board', {
        timeout: 20_000,
      })
      .catch(() => null);
    const errorVisible =
      (await page.locator('[data-testid="game-load-error"]').count()) > 0;
    const retryVisible =
      (await page.locator('[data-action="retry"]').count()) > 0;
    const hint = await page
      .locator('[data-testid="game-load-error-hint"]')
      .textContent()
      .catch(() => null);

    blockHex = false;
    let recovered = false;
    if (retryVisible) {
      await page.locator('[data-action="retry"]').click();
      await page
        .waitForSelector('.hex-board, #board', { timeout: 30_000 })
        .catch(() => null);
      recovered = (await page.locator('.hex-board, #board').count()) > 0;
    }

    findings.scenarios.chunkLoadFailureRetry = {
      description:
        'Abort Hex JS chunk after shell load; expect friendly error + retry recovery',
      errorVisible,
      retryVisible,
      hint,
      recovered,
    };
    await context.close();
  }

  // --- Scenario D: offline WITHOUT waiting for SW (first paint only) ---
  {
    const context = await browser.newContext();
    const page = await context.newPage();
    // Load once briefly then go offline before SW finishes? Better: fresh context
    // that never visits, then offline — documents cold-offline failure.
    await context.setOffline(true);
    let coldError = null;
    try {
      await page.goto(baseURL + '/', { waitUntil: 'domcontentloaded', timeout: 10_000 });
    } catch (e) {
      coldError = String(e.message || e);
    }
    findings.scenarios.coldOfflineNoPrecache = {
      description: 'Offline before any visit — shell cannot load',
      navigated: coldError == null,
      error: coldError,
      bodyText: coldError
        ? null
        : (await page.locator('body').innerText().catch(() => '')).slice(0, 200),
    };
    await context.close();
  }

  await browser.close();
  preview.kill('SIGTERM');

  writeFileSync(OUT, JSON.stringify(findings, null, 2));
  console.log('Wrote', OUT);
  console.log(JSON.stringify(findings, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
