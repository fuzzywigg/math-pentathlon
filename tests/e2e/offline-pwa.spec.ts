/**
 * Offline PWA keeper (smoke lineage from #370): after one online visit against
 * a production build, airplane mode still loads the menu, opens Hex, and gets
 * a computer move — proving popular game chunks were warmed/precached.
 *
 * Self-hosts `vite preview` so the generated service worker is active.
 * Does not modify the shared Playwright webServer (dev) used by other specs.
 *
 * Navigation strategy:
 * - Chromium / Firefox: full `page.goto` offline (SW serves shell + chunks).
 * - WebKit: SPA soft-nav after idle-warm. Playwright WebKit `setOffline`
 *   breaks controlled-page fetch()/module import of precached URLs (and can
 *   throw on offline goto); see docs/webkit-offline-pwa-2026-10-07.md.
 */
import { test } from './fixtures';
import { expect, type Page } from '@playwright/test';
import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process';
import { once } from 'node:events';
import { createServer } from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { installE2eStability } from './helpers/stability';
import {
  waitForGameReady,
  dismissOwl,
} from './helpers/page';

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

/**
 * Wait until `url` responds (ok/404). Retries are driven by preview stdout/stderr
 * activity or an initial probe — not a fixed wall-clock sleep.
 */
async function waitForUrl(
  url: string,
  child: ChildProcessWithoutNullStreams,
  timeoutMs = 60_000
): Promise<void> {
  const signal = AbortSignal.timeout(timeoutMs);

  const tryFetch = async (): Promise<boolean> => {
    try {
      const res = await fetch(url, { signal });
      return res.ok || res.status === 404;
    } catch {
      return false;
    }
  };

  if (await tryFetch()) return;

  await new Promise<void>((resolve, reject) => {
    let settled = false;
    let probing = false;

    const cleanup = () => {
      child.stdout.off('data', onActivity);
      child.stderr.off('data', onActivity);
      child.off('exit', onExit);
      signal.removeEventListener('abort', onAbort);
    };

    const finish = (err?: Error) => {
      if (settled) return;
      settled = true;
      cleanup();
      if (err) reject(err);
      else resolve();
    };

    const probe = () => {
      if (settled || probing) return;
      probing = true;
      void tryFetch().then((ok) => {
        probing = false;
        if (ok) finish();
      });
    };

    const onActivity = () => {
      probe();
    };
    const onExit = (code: number | null) => {
      finish(
        new Error(`preview exited before ${url} was ready (code ${code})`)
      );
    };
    const onAbort = () => {
      finish(new Error(`Timed out waiting for ${url}`));
    };

    child.stdout.on('data', onActivity);
    child.stderr.on('data', onActivity);
    child.on('exit', onExit);
    signal.addEventListener('abort', onAbort, { once: true });
    // Server may already be listening before listeners attach.
    probe();
  });
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

async function waitForIdleWarm(page: Page): Promise<void> {
  await page.waitForFunction(
    () =>
      document.documentElement.getAttribute('data-mp-idle-warm') === 'done',
    null,
    { timeout: 30_000 }
  );
}

/** New Game → human vs AI → Easy (keeps Hex worker reply wall time low). */
async function startHexVsAiEasy(page: Page): Promise<void> {
  await waitForGameReady(page);
  await dismissOwl(page);
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
  await dismissOwl(page);
}

/**
 * Hex-only: human places center stone, then computer must place a p2 stone.
 * If the AI path is missing offline, this poll times out (worker or sync fallback).
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

async function offlineOpenMenuAndHex(
  page: Page,
  baseURL: string,
  browserName: string
): Promise<void> {
  if (browserName === 'webkit') {
    // Soft hash nav keeps the warmed module map (product SPA path).
    await page.evaluate(() => {
      location.hash = '#/';
    });
    await expect(page.locator('.game-card').first()).toBeVisible({
      timeout: 15_000,
    });
    await page.evaluate(() => {
      location.hash = '#/game/hex';
    });
    return;
  }

  await page.goto(`${baseURL}/#/`);
  await expect(page.locator('.game-card').first()).toBeVisible({
    timeout: 15_000,
  });
  await page.goto(`${baseURL}/#/game/hex`);
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
        // Own process group so afterAll can SIGTERM/KILL the whole tree.
        detached: true,
      }
    );

    await waitForUrl(baseURL, preview);
  });

  test.afterAll(async () => {
    if (!preview) return;
    const pid = preview.pid;
    if (pid && !preview.killed) {
      // SIGTERM the whole process group if we started detached; else the child.
      try {
        process.kill(-pid, 'SIGTERM');
      } catch {
        preview.kill('SIGTERM');
      }
      // Condition wait: exit event, with a grace deadline before SIGKILL.
      const alreadyExited =
        preview.exitCode != null || preview.signalCode != null;
      const exited =
        alreadyExited ||
        (await Promise.race([
          once(preview, 'exit').then(() => true as const),
          new Promise<false>((resolve) => {
            AbortSignal.timeout(500).addEventListener(
              'abort',
              () => resolve(false),
              { once: true }
            );
          }),
        ]));
      if (!exited) {
        try {
          process.kill(-pid, 'SIGKILL');
        } catch {
          if (!preview.killed) preview.kill('SIGKILL');
        }
      }
    }
  });

  test('menu + Hex computer move offline after first online visit', async ({
    browser,
    browserName,
  }) => {
    test.setTimeout(120_000);

    const swRes = await fetch(`${baseURL}/sw.js`);
    expect(swRes.ok).toBeTruthy();
    expect(await swRes.text()).toMatch(/precache|workbox/i);

    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    await installE2eStability(page);

    // One online visit so Workbox precaches shell + game + AI worker chunks
    // and idle-warm pulls route-mount / play CSS / Hex into the module map.
    await page.goto(`${baseURL}/`);
    await expect(page.locator('.game-card').first()).toBeVisible({
      timeout: 15_000,
    });
    await waitForServiceWorkerControl(page);
    await waitForIdleWarm(page);

    await context.setOffline(true);

    await offlineOpenMenuAndHex(page, baseURL, browserName);
    await waitForGameReady(page);
    await expect(page.locator('h1')).toContainText('Hex', { timeout: 15_000 });
    await expect(page.locator('.hex-board, #board').first()).toBeVisible();
    await startHexVsAiEasy(page);
    await playHexHumanThenAwaitComputer(page);

    await context.close();
  });
});
