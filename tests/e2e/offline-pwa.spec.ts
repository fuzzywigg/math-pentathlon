/**
 * Offline PWA keeper (smoke lineage from #370): after one online visit against
 * a production build, airplane mode still loads the menu, opens Hex, and gets
 * a computer move — proving the Hex AI worker chunk was precached.
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

async function waitForGameReady(page: Page): Promise<void> {
  await expect(page.getByTestId('game-loading')).toBeHidden({
    timeout: 15_000,
  });
  await expect(page.locator('#new-game-btn, h1').first()).toBeVisible({
    timeout: 15_000,
  });
}

async function dismissOwlIfNeeded(page: Page): Promise<void> {
  const dismiss = page.locator(
    '#ollie-owl button[aria-label="Dismiss message"], #ollie-owl .owl-bubble-dismiss'
  );
  if (await dismiss.first().isVisible().catch(() => false)) {
    await dismiss.first().click({ force: true });
  }
  const minimize = page.locator('#ollie-owl .owl-minimize-btn');
  if (await minimize.isVisible().catch(() => false)) {
    await minimize.click({ force: true });
  }
  await page.evaluate(() => {
    const el = document.getElementById('ollie-owl');
    if (el) {
      (el as HTMLElement).style.pointerEvents = 'none';
    }
  });
}

/** New Game → human vs AI → Easy (keeps Hex worker reply wall time low). */
async function startHexVsAiEasy(page: Page): Promise<void> {
  await waitForGameReady(page);
  await dismissOwlIfNeeded(page);
  await page.locator('#new-game-btn').click();
  const modal = page.locator('#new-game-modal');
  await expect(modal).toBeVisible({ timeout: 10_000 });
  await page.locator('.mode-option[data-mode="human-vs-ai"]').click();
  const easy = page.locator('.difficulty-btn.easy');
  if (await easy.isVisible().catch(() => false)) {
    await easy.click();
  }
  await page.locator('#start-game-btn').click();
  await expect(modal).toHaveClass(/hidden/);
  await dismissOwlIfNeeded(page);
}

/**
 * Hex-only: human places center stone, then computer must place a p2 stone.
 * If the AI worker chunk is missing offline, this poll times out.
 */
async function playHexHumanThenAwaitComputer(page: Page): Promise<void> {
  const beforeP2 = await page.locator('.hex-cell-p2').count();
  await page
    .locator('.hex-cell-group[data-row="5"][data-col="5"]')
    .click({ force: true });

  await expect
    .poll(async () => page.locator('.hex-cell-p2').count(), {
      timeout: 45_000,
    })
    .toBeGreaterThan(beforeP2);
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

  test('menu + Hex computer move offline after first online visit', async ({
    browser,
  }) => {
    test.setTimeout(120_000);

    const swRes = await fetch(`${baseURL}/sw.js`);
    expect(swRes.ok).toBeTruthy();
    expect(await swRes.text()).toMatch(/precache|workbox/i);

    const context = await browser.newContext();
    const page = await context.newPage();

    // One online visit so Workbox precaches shell + game + AI worker chunks.
    await page.goto(`${baseURL}/`);
    await expect(page.locator('.game-card').first()).toBeVisible({
      timeout: 15_000,
    });
    await waitForServiceWorkerControl(page);

    await context.setOffline(true);

    // Offline menu still works from precache.
    await page.goto(`${baseURL}/#/`);
    await expect(page.locator('.game-card').first()).toBeVisible({
      timeout: 15_000,
    });

    // Offline Hex mount + Easy vs-AI reply proves the worker chunk is cached.
    await page.goto(`${baseURL}/#/game/hex`);
    await waitForGameReady(page);
    await expect(page.locator('h1')).toContainText('Hex', { timeout: 15_000 });
    await expect(page.locator('.hex-board, #board').first()).toBeVisible();
    await startHexVsAiEasy(page);
    await playHexHumanThenAwaitComputer(page);

    await context.close();
  });
});
