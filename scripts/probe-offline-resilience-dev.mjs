/**
 * Chromium probe against vite *dev* (no service worker): offline-after-first-load
 * and forced font / game-chunk / three.js failures. Complements the production SW probe.
 */
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = '/opt/cursor/artifacts/offline-resilience-probe-dev.json';
const PROD_OUT = '/opt/cursor/artifacts/offline-resilience-probe.json';

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

async function waitForUrl(url, timeoutMs = 60_000) {
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

function classify(url) {
  if (/\/fonts\/|\.woff2?(?:\?|$)/i.test(url)) return 'font';
  if (/three|board-3d|\/ui\/three/i.test(url)) return '3d-asset';
  if (/game-controller|\/games\//i.test(url)) return 'lazy-game-chunk';
  if (/\.css(\?|$)/i.test(url)) return 'css';
  if (/\.js|\.ts(\?|$)/i.test(url)) return 'js';
  return 'other';
}

function shorten(url) {
  try {
    const u = new URL(url);
    return u.pathname + u.search;
  } catch {
    return url;
  }
}

function tally(failed) {
  return failed.reduce((acc, f) => {
    const k = f.kind || classify(f.url);
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});
}

async function main() {
  mkdirSync(path.dirname(OUT), { recursive: true });
  const findings = {
    date: '2026-10-07',
    browser: 'chromium',
    mode: 'vite-dev',
    scenarios: {},
  };

  const port = await getFreePort();
  const baseURL = `http://127.0.0.1:${port}`;
  const dev = spawn(
    'npx',
    ['vite', '--host', '127.0.0.1', '--port', String(port), '--strictPort'],
    { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'], env: process.env }
  );
  await waitForUrl(baseURL);
  console.log('Dev server at', baseURL);

  const browser = await chromium.launch();

  // A: menu online, then offline — open Calla (not idle-warmed Div I)
  {
    const context = await browser.newContext();
    const page = await context.newPage();
    const failed = [];
    page.on('requestfailed', (req) => {
      failed.push({
        url: shorten(req.url()),
        resourceType: req.resourceType(),
        failure: req.failure()?.errorText ?? 'unknown',
        kind: classify(req.url()),
      });
    });

    await page.goto(baseURL + '/', { waitUntil: 'networkidle', timeout: 60_000 });
    await page.waitForSelector('.game-card', { timeout: 30_000 });

    const fontsOnline = await page.evaluate(async () => {
      await document.fonts.ready;
      return [...document.fonts].map((f) => ({
        family: f.family,
        weight: f.weight,
        status: f.status,
      }));
    });

    await context.setOffline(true);

    await page.evaluate(() => {
      location.hash = '#/';
    });
    await page.waitForTimeout(400);
    const menuStillVisible = (await page.locator('.game-card').count()) > 0;

    // Calla is Division II — not in idle-warm / first-division prefetch list.
    await page.evaluate(() => {
      location.hash = '#/game/calla';
    });
    await page
      .waitForSelector('[data-testid="game-load-error"], .calla-wrapper, .calla-pit', {
        timeout: 15_000,
      })
      .catch(() => null);

    findings.scenarios.devOfflineAfterFirstLoad = {
      description:
        'Vite dev (no SW): menu online → offline → open Calla (unwarmed lazy chunk)',
      fontsOnline,
      menuStillVisible,
      dataOffline: (await page.locator('html[data-offline="true"]').count()) > 0,
      callaBoard:
        (await page.locator('.calla-wrapper, .calla-pit, #board').count()) > 0,
      callaLoadError:
        (await page.locator('[data-testid="game-load-error"]').count()) > 0,
      callaHint: await page
        .locator('[data-testid="game-load-error-hint"]')
        .textContent()
        .catch(() => null),
      retryVisible: (await page.locator('[data-action="retry"]').count()) > 0,
      failed: failed.slice(0, 40),
      failedByKind: tally(failed),
    };
    await context.close();
  }

  // B: abort fonts
  {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.route('**/fonts/**', (route) => route.abort('failed'));
    await page.goto(baseURL + '/', { waitUntil: 'domcontentloaded', timeout: 60_000 });
    await page.waitForSelector('.game-card', { timeout: 30_000 });
    const fontInfo = await page.evaluate(async () => {
      await document.fonts.ready;
      const inter = [...document.fonts].filter((f) => f.family.includes('Inter'));
      return {
        interCount: inter.length,
        interStatuses: inter.map((f) => f.status),
        bodyFontFamily: getComputedStyle(document.body).fontFamily,
      };
    });
    findings.scenarios.fontAbort = {
      description: 'Abort /fonts/* on cold load — Inter fails, system stack remains',
      fontInfo,
      menuVisible: (await page.locator('.game-card').count()) > 0,
    };
    await context.close();
  }

  // C: abort three.js while opening Hex-a-Gone
  {
    const context = await browser.newContext();
    const page = await context.newPage();
    const failed = [];
    page.on('requestfailed', (req) => {
      failed.push({ url: shorten(req.url()), kind: classify(req.url()) });
    });
    await page.route('**/node_modules/three/**', (route) => route.abort('failed'));
    await page.route('**/ui/three/**', (route) => route.abort('failed'));
    await page.goto(baseURL + '/#/game/hex-a-gone', {
      waitUntil: 'domcontentloaded',
      timeout: 60_000,
    });
    await page
      .waitForSelector(
        '.hex-a-gone-board, #board, [data-testid="game-load-error"], canvas[data-mp3d]',
        { timeout: 20_000 }
      )
      .catch(() => null);
    findings.scenarios.threeAbort = {
      description:
        'Abort three.js + ui/three while opening Hex-a-Gone (2D fallback expected)',
      gameLoadError:
        (await page.locator('[data-testid="game-load-error"]').count()) > 0,
      board2d: (await page.locator('.hex-a-gone-board, #board').count()) > 0,
      canvas3d: (await page.locator('canvas[data-mp3d]').count()) > 0,
      title: await page.locator('h1').textContent().catch(() => null),
      failed: failed.slice(0, 20),
    };
    await context.close();
  }

  // D: Slow 3G on vite-dev
  {
    const context = await browser.newContext();
    const page = await context.newPage();
    const cdp = await context.newCDPSession(page);
    await cdp.send('Network.enable');
    await cdp.send('Network.emulateNetworkConditions', SLOW_3G);
    const failed = [];
    page.on('requestfailed', (req) => {
      failed.push({
        url: shorten(req.url()),
        kind: classify(req.url()),
        failure: req.failure()?.errorText ?? 'unknown',
      });
    });

    const t0 = Date.now();
    await page.goto(baseURL + '/', { waitUntil: 'domcontentloaded', timeout: 180_000 });
    await page.waitForSelector('.game-card', { timeout: 180_000 });
    const menuMs = Date.now() - t0;

    const tCalla = Date.now();
    await page.evaluate(() => {
      location.hash = '#/game/calla';
    });
    await page
      .waitForSelector(
        '.calla-wrapper, .calla-pit, #board, [data-testid="game-load-error"]',
        { timeout: 180_000 }
      )
      .catch(() => null);
    const callaMs = Date.now() - tCalla;

    findings.scenarios.devSlow3g = {
      description: 'Vite dev Slow 3G: menu + Calla (no Workbox precache)',
      menuMs,
      callaMs,
      callaOk:
        (await page.locator('.calla-wrapper, .calla-pit, #board').count()) > 0,
      callaErr: (await page.locator('[data-testid="game-load-error"]').count()) > 0,
      failed: failed.slice(0, 30),
      failedByKind: tally(failed),
    };
    await context.close();
  }

  // E: chunk abort + retry (Calla, route armed before navigation)
  {
    const context = await browser.newContext();
    const page = await context.newPage();
    let fail = true;
    await page.route('**/games/calla/game-controller*', async (route) => {
      if (fail) {
        await route.abort('failed');
        return;
      }
      await route.continue();
    });
    await page.goto(baseURL + '/#/game/calla', {
      waitUntil: 'domcontentloaded',
      timeout: 60_000,
    });
    await page.waitForSelector('[data-testid="game-load-error"]', {
      timeout: 15_000,
    });
    const hint = await page
      .locator('[data-testid="game-load-error-hint"]')
      .textContent();
    fail = false;
    await Promise.all([
      page.waitForLoadState('domcontentloaded'),
      page.locator('[data-action="retry"]').click(),
    ]);
    await page
      .waitForSelector('.calla-wrapper, .calla-pit, #board', { timeout: 20_000 })
      .catch(() => null);
    findings.scenarios.devChunkRetry = {
      description:
        'Abort Calla game-controller, show retry UI, unblock, reload-recover',
      errorVisible: true,
      hint,
      recovered:
        (await page.locator('.calla-wrapper, .calla-pit, #board').count()) > 0,
    };
    await context.close();
  }

  await browser.close();
  dev.kill('SIGTERM');

  let prod = null;
  try {
    prod = JSON.parse(readFileSync(PROD_OUT, 'utf8'));
  } catch {
    prod = null;
  }

  const merged = { productionPreview: prod, viteDev: findings };
  writeFileSync(OUT, JSON.stringify(merged, null, 2));
  console.log('Wrote', OUT);
  console.log(JSON.stringify(findings, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
