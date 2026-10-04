/**
 * Offline PWA smoke: after one online visit against a production build,
 * airplane mode still loads the shell and a game vs the computer.
 *
 * Self-hosts `vite preview` so the generated service worker is active.
 * Does not modify the shared Playwright webServer (dev) used by other specs.
 */
import { expect, test, type Page } from '@playwright/test';
import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process';
import { createServer } from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../..'
);

async function getFreePort(): Promise<number> {
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

async function waitForUrl(url: string, timeoutMs = 60_000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok || res.status === 404) return;
    } catch {
      // still booting
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error(`Timed out waiting for ${url}`);
}

async function dismissModeIfNeeded(page: Page): Promise<void> {
  const modal = page.locator('#new-game-modal');
  if (await modal.isVisible().catch(() => false)) {
    const start = page.locator('#start-game-btn');
    if (await start.isVisible().catch(() => false)) {
      await start.click();
    }
  }
}

async function waitForServiceWorkerControl(page: Page): Promise<void> {
  await page.waitForFunction(
    async () => {
      if (!('serviceWorker' in navigator)) return false;
      const reg = await navigator.serviceWorker.ready;
      return reg.active?.state === 'activated';
    },
    null,
    { timeout: 45_000 }
  );

  // First visit often activates without controlling this tab yet — reload once.
  const hasController = await page.evaluate(
    () => navigator.serviceWorker.controller != null
  );
  if (!hasController) {
    await page.reload({ waitUntil: 'load' });
  }

  await page.waitForFunction(
    () => navigator.serviceWorker.controller != null,
    null,
    { timeout: 45_000 }
  );
}

test.describe('offline PWA', () => {
  let preview: ChildProcessWithoutNullStreams | undefined;
  let baseURL = '';

  test.beforeAll(async () => {
    const port = await getFreePort();
    baseURL = `http://127.0.0.1:${port}`;

    await new Promise<void>((resolve, reject) => {
      const build = spawn('npm', ['run', 'build'], {
        cwd: ROOT,
        stdio: ['ignore', 'pipe', 'pipe'],
        env: process.env,
      });
      let err = '';
      build.stderr.on('data', (chunk: Buffer) => {
        err += chunk.toString();
      });
      build.on('exit', (code) => {
        if (code === 0) resolve();
        else reject(new Error(`build failed (${code}): ${err}`));
      });
    });

    preview = spawn(
      'npx',
      [
        'vite',
        'preview',
        '--host',
        '127.0.0.1',
        '--port',
        String(port),
        '--strictPort',
      ],
      {
        cwd: ROOT,
        stdio: ['ignore', 'pipe', 'pipe'],
        env: process.env,
      }
    );

    await waitForUrl(baseURL);
  });

  test.afterAll(async () => {
    if (preview && !preview.killed) {
      preview.kill('SIGTERM');
    }
  });

  test('plays a game offline after first online visit', async ({ browser }) => {
    const swRes = await fetch(`${baseURL}/sw.js`);
    expect(swRes.ok).toBeTruthy();
    expect(await swRes.text()).toMatch(/precache|workbox/i);

    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(`${baseURL}/`);
    await expect(page.locator('.game-card').first()).toBeVisible({
      timeout: 15_000,
    });

    await waitForServiceWorkerControl(page);

    await page.goto(`${baseURL}/#/game/hex`);
    await expect(page.getByTestId('game-loading')).toBeHidden({
      timeout: 15_000,
    });
    await expect(page.locator('h1')).toContainText('Hex', { timeout: 15_000 });
    await dismissModeIfNeeded(page);
    await expect(page.locator('.hex-board, #board').first()).toBeVisible();

    await context.setOffline(true);

    await page.reload();
    await expect(page.locator('h1')).toContainText('Hex', { timeout: 15_000 });
    await dismissModeIfNeeded(page);

    await page.goto(`${baseURL}/#/`);
    await expect(page.locator('.game-card').first()).toBeVisible({
      timeout: 15_000,
    });

    await page.goto(`${baseURL}/#/game/calla`);
    await expect(page.getByTestId('game-loading')).toBeHidden({
      timeout: 15_000,
    });
    await expect(page.locator('h1')).toContainText('Calla', {
      timeout: 15_000,
    });
    await dismissModeIfNeeded(page);
    await expect(page.locator('#board').first()).toBeVisible();

    await context.close();
  });
});
