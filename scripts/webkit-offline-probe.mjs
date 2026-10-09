/**
 * Minimal reproduction: Playwright WebKit offline vs Workbox precache.
 *
 * Evidence: caches.match hits, but controlled-page fetch()/import() of the
 * same URLs fail under context.setOffline(true). Chromium/Firefox succeed.
 *
 * Run: node scripts/webkit-offline-probe.mjs
 * Expects an existing `dist/` from `npm run build` (skips rebuild if present
 * unless FORCE_BUILD=1).
 */
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { chromium, firefox, webkit } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BROWSERS = process.env.PROBE_BROWSERS?.split(',') ?? ['webkit'];

async function getFreePort() {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      if (!address || typeof address === 'string') {
        server.close();
        reject(new Error('no port'));
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
  throw new Error(`timeout ${url}`);
}

async function waitForSw(page) {
  await page.waitForFunction(async () => {
    if (!('serviceWorker' in navigator)) return false;
    const reg = await navigator.serviceWorker.ready;
    return reg.active?.state === 'activated';
  }, null, { timeout: 45_000 });
  if (!(await page.evaluate(() => navigator.serviceWorker.controller != null))) {
    await page.reload({ waitUntil: 'load' });
  }
  await page.waitForFunction(
    () => navigator.serviceWorker.controller != null,
    null,
    { timeout: 45_000 }
  );
}

async function probe(browserType, name, baseURL) {
  const browser = await browserType.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  const consoleMsgs = [];
  page.on('console', (m) => {
    if (/fail|error|load/i.test(m.text())) {
      consoleMsgs.push(`[${m.type()}] ${m.text()}`);
    }
  });

  await page.goto(`${baseURL}/`);
  await page.waitForSelector('.game-card', { timeout: 15_000 });
  await waitForSw(page);
  // Allow idle-warm (ric timeout 4s) to pull Hex into the module map.
  await page.waitForTimeout(5_500);

  const onlineDiag = await page.evaluate(async () => {
    const keys = await caches.keys();
    const urls = [];
    for (const key of keys) {
      const cache = await caches.open(key);
      for (const req of await cache.keys()) urls.push(req.url);
    }
    // Vite content hashes may include `_` (e.g. game-hex-DWW_girN.js). Exclude
    // hex-a-gone so a looser pattern never picks the wrong chunk.
    const hexUrl = urls.find((u) =>
      /\/game-hex-(?!a-gone)[A-Za-z0-9_-]+\.js$/.test(u)
    );
    const routesUrl = urls.find((u) =>
      /\/game-routes-[A-Za-z0-9_-]+\.js$/.test(u)
    );
    const workerUrl = urls.find((u) =>
      /\/ai\.worker-[A-Za-z0-9_-]+\.js$/.test(u)
    );
    return {
      cacheCount: urls.length,
      hexUrl: hexUrl ?? null,
      routesUrl: routesUrl ?? null,
      workerUrl: workerUrl ?? null,
      matchHex: hexUrl ? !!(await caches.match(hexUrl))?.ok : null,
      matchRoutes: routesUrl ? !!(await caches.match(routesUrl))?.ok : null,
      matchWorker: workerUrl ? !!(await caches.match(workerUrl))?.ok : null,
    };
  });

  await context.setOffline(true);

  const offlineImport = await page.evaluate(async (diag) => {
    const results = {};
    async function tryFetch(label, url) {
      if (!url) {
        results[`${label}Fetch`] = { ok: false, error: 'url missing' };
        return;
      }
      try {
        const res = await fetch(url);
        results[`${label}Fetch`] = { ok: res.ok, status: res.status };
      } catch (e) {
        results[`${label}Fetch`] = {
          ok: false,
          error: String(e?.message ?? e),
        };
      }
    }
    async function tryImport(label, url) {
      if (!url) {
        results[label] = { ok: false, error: 'url missing' };
        return;
      }
      try {
        await import(/* @vite-ignore */ url);
        results[label] = { ok: true };
      } catch (e) {
        results[label] = {
          ok: false,
          error: String(e?.message ?? e),
          name: e?.name,
        };
      }
    }
    async function tryWorker(url) {
      if (!url) {
        results.worker = { ok: false, error: 'url missing' };
        return;
      }
      try {
        const w = new Worker(url, { type: 'module' });
        await new Promise((resolve, reject) => {
          const t = setTimeout(() => reject(new Error('worker timeout')), 3_000);
          w.onerror = (ev) => {
            clearTimeout(t);
            reject(new Error(ev.message || 'worker error'));
          };
          // Module workers that parse successfully don't always post; treat
          // "no immediate error" as a soft ok after a short settle.
          setTimeout(() => {
            clearTimeout(t);
            resolve(undefined);
          }, 800);
        });
        w.terminate();
        results.worker = { ok: true };
      } catch (e) {
        results.worker = { ok: false, error: String(e?.message ?? e) };
      }
    }

    await tryFetch('hex', diag.hexUrl);
    await tryFetch('routes', diag.routesUrl);
    await tryFetch('worker', diag.workerUrl);
    await tryImport('hex', diag.hexUrl);
    await tryImport('routes', diag.routesUrl);
    await tryWorker(diag.workerUrl);

    location.hash = '#/game/hex';
    await new Promise((r) => setTimeout(r, 4_000));
    results.softNav = {
      hasLoadError: !!document.querySelector('[data-testid="game-load-error"]'),
      hasBoard: !!document.querySelector('.hex-board, #board'),
      h1: document.querySelector('h1')?.textContent ?? null,
    };
    return results;
  }, onlineDiag);

  let gotoNav = null;
  try {
    await page.goto(`${baseURL}/#/game/hex`, {
      waitUntil: 'domcontentloaded',
      timeout: 15_000,
    });
    await page.waitForTimeout(2_500);
    gotoNav = await page.evaluate(() => ({
      hasLoadError: !!document.querySelector('[data-testid="game-load-error"]'),
      hasBoard: !!document.querySelector('.hex-board, #board'),
      h1: document.querySelector('h1')?.textContent ?? null,
    }));
  } catch (e) {
    gotoNav = { fatal: String(e).split('\n')[0] };
  }

  await context.close();
  await browser.close();
  return { browser: name, onlineDiag, offlineImport, gotoNav, consoleMsgs: consoleMsgs.slice(0, 10) };
}

const port = await getFreePort();
const baseURL = `http://127.0.0.1:${port}`;

if (process.env.FORCE_BUILD === '1' || !existsSync(path.join(ROOT, 'dist/sw.js'))) {
  console.error('building…');
  await new Promise((resolve, reject) => {
    const build = spawn('npm', ['run', 'build'], {
      cwd: ROOT,
      stdio: 'inherit',
      env: process.env,
    });
    build.on('exit', (code) =>
      code === 0 ? resolve() : reject(new Error(`build ${code}`))
    );
  });
}

const preview = spawn(
  'npx',
  ['vite', 'preview', '--host', '127.0.0.1', '--port', String(port), '--strictPort'],
  { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'], env: process.env }
);
try {
  await waitForUrl(baseURL);
  console.error('preview', baseURL);

  const map = { webkit, firefox, chromium };
  const out = {};
  for (const name of BROWSERS) {
    const bt = map[name];
    if (!bt) throw new Error(`unknown browser ${name}`);
    console.error('probing', name);
    out[name] = await probe(bt, name, baseURL);
  }
  console.log(JSON.stringify(out, null, 2));
  try {
    const outPath = '/opt/cursor/artifacts/webkit-offline-probe.json';
    mkdirSync('/opt/cursor/artifacts', { recursive: true });
    writeFileSync(outPath, JSON.stringify(out, null, 2));
    console.error('Wrote', outPath);
  } catch (e) {
    console.error('artifact write skipped:', e?.message ?? e);
  }
} finally {
  preview.kill('SIGTERM');
  // vite preview can keep the event loop alive after SIGTERM; force exit.
  setTimeout(() => process.exit(0), 500).unref();
}
