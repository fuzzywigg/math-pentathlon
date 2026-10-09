/**
 * burn-1008-mp-history-routing — browser history / deep-link / refresh /
 * multi-tab / PWA standalone launch patterns across all 20 games.
 *
 * Covers glue only (hash router + shell lifecycle). No rules/AI assertions.
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect } from './fixtures';
import type { Page } from '@playwright/test';
import { installE2eStability } from './helpers/stability';
import { GAMES } from '../../src/core/game-registry';

const AVAILABLE_GAMES = GAMES.filter((g) => g.available);

/** Primary board / play surface that proves the game mounted. */
const MOUNT: Record<string, string> = {
  'kings-quadraphages': '#board .board .cell, .cell-king',
  hex: '.hex-board',
  'star-track': '.star-track-board',
  'hex-a-gone': '.hex-a-gone-board',
  calla: '.calla-wrapper, .calla-pit',
  'sum-dominoes': '.sd-board',
  'par-55': '.par55-board',
  ramrod: '.ramrod-board',
  'kwatro-sinko': '.kwa-board',
  fiar: '.fiar-board-container',
  juggle: '.juggle-board',
  'contig-60': '.contig-board',
  'stars-bars': '.stars-board',
  'fab-a-diffy': '.fab-bar-pool, .fab-answer-board',
  'queens-guards': '.qg-board-container',
  'prime-gold': '.pg-board, .prime-board',
  'remainder-islands': '.remainder-board',
  'pent-em-in': '.pent-board',
  'frac-fact': '.frac-problem, .frac-choice-btn',
  'fraction-pinball':
    '.pinball-board, .pinball-challenge, .pinball-game-container, .pinball-choice-btn',
};

async function dismissOwlIfNeeded(page: Page): Promise<void> {
  const dismiss = page.locator(
    '#ollie-owl button[aria-label="Dismiss message"], #ollie-owl .owl-bubble-dismiss'
  );
  if (await dismiss.first().isVisible().catch(() => false)) {
    await dismiss.first().click({ force: true });
  }
  await page.evaluate(() => {
    const el = document.getElementById('ollie-owl');
    if (el) (el as HTMLElement).style.pointerEvents = 'none';
  });
}

async function waitForGameReady(page: Page): Promise<void> {
  await expect(page.getByTestId('game-loading')).toBeHidden({
    timeout: 15_000,
  });
  await expect(page.locator('#new-game-btn, h1').first()).toBeVisible({
    timeout: 15_000,
  });
}

async function waitForMenu(page: Page): Promise<void> {
  await expect(
    page.locator('.game-selector, .game-card, [data-testid="game-selector"]').first()
  ).toBeVisible({ timeout: 15_000 });
}

function mountSel(gameId: string): string {
  return MOUNT[gameId] ?? '#board, #game-container, main';
}

test.describe('history routing (parameterized @history)', () => {
  for (const game of AVAILABLE_GAMES) {
    test(`${game.id}: deep link + back/forward + refresh + tutorial/help history`, async ({
      page,
    }) => {
      // Seed menu so Back has an in-app entry (not about:blank).
      await page.goto('/#/');
      await waitForMenu(page);

      // --- Direct deep link (hash push keeps menu in history) ---
      await page.evaluate((id) => {
        window.location.hash = `/game/${id}`;
      }, game.id);
      await waitForGameReady(page);
      await expect(page.locator(mountSel(game.id)).first()).toBeVisible({
        timeout: 15_000,
      });
      await expect(page).toHaveURL(new RegExp(`#/game/${game.id}`));

      // --- Browser Back → menu ---
      await page.goBack();
      await waitForMenu(page);
      await expect(page).toHaveURL(/#\/?$/);

      // --- Browser Forward → game ---
      await page.goForward();
      await waitForGameReady(page);
      await expect(page.locator(mountSel(game.id)).first()).toBeVisible({
        timeout: 15_000,
      });
      // Exactly one shell (no double-mount).
      await expect(page.locator('#new-game-btn')).toHaveCount(1);
      await expect(page.locator('#back-btn')).toHaveCount(1);

      // --- Hard refresh mid-game: hash preserved, fresh mount (no crash) ---
      await page.reload();
      await waitForGameReady(page);
      await expect(page).toHaveURL(new RegExp(`#/game/${game.id}`));
      await expect(page.locator(mountSel(game.id)).first()).toBeVisible({
        timeout: 15_000,
      });
      await expect(page.locator('#new-game-btn')).toHaveCount(1);

      // --- Tutorial / Help do not push history; Back leaves the game ---
      // Reload clears in-app history — re-seed menu→game before Back checks.
      await page.goto('/#/');
      await waitForMenu(page);
      await page.evaluate((id) => {
        window.location.hash = `/game/${id}`;
      }, game.id);
      await waitForGameReady(page);
      await dismissOwlIfNeeded(page);

      const tutorialBtn = page.locator('#tutorial-btn');
      if (await tutorialBtn.isVisible().catch(() => false)) {
        await tutorialBtn.click();
        await expect(page.locator('#back-btn')).toBeVisible();
        await page.goBack();
        await waitForMenu(page);
        await expect(page).toHaveURL(/#\/?$/);
        await page.evaluate((id) => {
          window.location.hash = `/game/${id}`;
        }, game.id);
        await waitForGameReady(page);
        await dismissOwlIfNeeded(page);
      }

      const helpBtn = page.locator('#help-btn');
      if (await helpBtn.isVisible().catch(() => false)) {
        await helpBtn.click();
        const helpModal = page.locator('#help-modal');
        await expect(helpModal).not.toHaveClass(/hidden/, { timeout: 5_000 });
        // Browser Back should leave the game route (modal did not push history).
        await page.goBack();
        await waitForMenu(page);
      }
    });

    test(`${game.id}: two tabs mount independently`, async ({ context }) => {
      const pageA = await context.newPage();
      const pageB = await context.newPage();
      await installE2eStability(pageA);
      await installE2eStability(pageB);
      await Promise.all([
        pageA.goto(`/#/game/${game.id}`),
        pageB.goto(`/#/game/${game.id}`),
      ]);
      await Promise.all([waitForGameReady(pageA), waitForGameReady(pageB)]);
      await expect(pageA.locator(mountSel(game.id)).first()).toBeVisible();
      await expect(pageB.locator(mountSel(game.id)).first()).toBeVisible();
      // Each tab has its own shell; no shared singleton crash.
      await expect(pageA.locator('#new-game-btn')).toHaveCount(1);
      await expect(pageB.locator('#new-game-btn')).toHaveCount(1);
      // Navigate one tab home — other tab stays on the game.
      await pageA.locator('#back-btn').click();
      await waitForMenu(pageA);
      await expect(pageB.locator(mountSel(game.id)).first()).toBeVisible();
      await pageA.close();
      await pageB.close();
    });
  }

  test('unknown hash route recovers to menu (no stuck view)', async ({
    page,
  }) => {
    await page.goto('/#/game/hex');
    await waitForGameReady(page);
    await page.evaluate(() => {
      window.location.hash = '/this-route-does-not-exist';
    });
    await waitForMenu(page);
    await expect(page).toHaveURL(/#\/?$/);
  });

  test('path-style deep link serves SPA shell (no 404)', async ({ page }) => {
    // Vite SPA fallback + public/_redirects (preview/CF Pages).
    const res = await page.goto('/game/hex');
    expect(res?.status()).not.toBe(404);
    // Hash router still needs a hash; path alone may show menu shell.
    // Soft-nav into the game to prove the document is our app, not an error page.
    await page.evaluate(() => {
      window.location.hash = '/game/hex';
    });
    await waitForGameReady(page);
    await expect(page.locator('.hex-board').first()).toBeVisible();
  });

  test('PWA standalone launch path opens menu at start_url', async ({
    page,
  }) => {
    await page.addInitScript(() => {
      const original = window.matchMedia.bind(window);
      window.matchMedia = ((query: string) => {
        if (query.includes('display-mode: standalone')) {
          return {
            matches: true,
            media: query,
            onchange: null,
            addListener: () => undefined,
            removeListener: () => undefined,
            addEventListener: () => undefined,
            removeEventListener: () => undefined,
            dispatchEvent: () => false,
          } as MediaQueryList;
        }
        return original(query);
      }) as typeof window.matchMedia;
    });

    // Manifest start_url is `/` — standalone launch lands on the menu.
    const res = await page.goto('/');
    expect(res?.ok() ?? true).toBeTruthy();
    await waitForMenu(page);

    // Manifest is emit-only (vite-plugin-pwa → dist/). Prefer the build
    // artifact when present; otherwise assert the vite.config contract.
    const distManifest = join(process.cwd(), 'dist/site.webmanifest');
    if (existsSync(distManifest)) {
      const manifest = JSON.parse(readFileSync(distManifest, 'utf8')) as {
        display?: string;
        start_url?: string;
      };
      expect(manifest.display).toBe('standalone');
      expect(manifest.start_url === '/' || manifest.start_url === './').toBe(
        true
      );
    } else {
      const viteConfig = readFileSync(
        join(process.cwd(), 'vite.config.ts'),
        'utf8'
      );
      expect(viteConfig).toMatch(/display:\s*'standalone'/);
      expect(viteConfig).toMatch(/start_url:\s*'\//);
    }

    // Standalone can still deep-link via hash after launch.
    await page.evaluate(() => {
      window.location.hash = '/game/calla';
    });
    await waitForGameReady(page);
    await expect(page.locator('.calla-wrapper, .calla-pit').first()).toBeVisible();
  });

  test('rapid back/forward does not double-mount shell', async ({ page }) => {
    await page.goto('/#/');
    await waitForMenu(page);
    await page.goto('/#/game/hex');
    await waitForGameReady(page);
    // Bounce history quickly.
    await page.goBack();
    await page.goForward();
    await page.goBack();
    await page.goForward();
    await waitForGameReady(page);
    await expect(page.locator('#new-game-btn')).toHaveCount(1);
    await expect(page.locator('.hex-board').first()).toBeVisible();
  });
});
