/**
 * burn-1008 — storage disabled (SecurityError on localStorage/sessionStorage).
 * Menu and every available game must still start; no error boundary / load error.
 */
import { test, expect, type Page } from '@playwright/test';
import { GAMES } from '../../src/core/game-registry';
import { installE2eStability } from './helpers/stability';

const AVAILABLE = GAMES.filter((g) => g.available);

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

async function blockWebStorage(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const blocked = (): never => {
      throw new DOMException(
        'Blocked by storage-blocked e2e',
        'SecurityError'
      );
    };
    const proxy = new Proxy(
      {},
      {
        get() {
          return blocked;
        },
      }
    );
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      get: () => proxy,
    });
    Object.defineProperty(window, 'sessionStorage', {
      configurable: true,
      get: () => proxy,
    });
  });
}

async function waitForGameReady(page: Page): Promise<void> {
  await expect(page.getByTestId('game-loading')).toBeHidden({
    timeout: 20_000,
  });
  await expect(page.locator('#new-game-btn, h1').first()).toBeVisible({
    timeout: 15_000,
  });
}

test.describe('storage blocked — menu + games still start', () => {
  test.beforeEach(async ({ page }) => {
    await installE2eStability(page);
    await blockWebStorage(page);
  });

  test('menu loads with game cards when Web Storage throws SecurityError', async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (err) => pageErrors.push(String(err)));

    await page.goto('/');
    await expect(page.locator('.game-card').first()).toBeVisible({
      timeout: 20_000,
    });
    const availableCards = page.locator(
      '.game-card:not(.game-card-disabled)'
    );
    await expect(availableCards).toHaveCount(AVAILABLE.length);
    expect(pageErrors).toEqual([]);
  });

  for (const game of AVAILABLE) {
    test(`${game.id} mounts when Web Storage is blocked`, async ({ page }) => {
      const pageErrors: string[] = [];
      page.on('pageerror', (err) => pageErrors.push(String(err)));

      await page.goto(`/#/game/${game.id}`);
      await waitForGameReady(page);

      await expect(page.getByTestId('game-error-boundary')).toHaveCount(0);
      await expect(page.getByTestId('game-load-error')).toHaveCount(0);

      const mountSel = MOUNT[game.id] ?? '#board, #game-container, main';
      await expect(page.locator(mountSel).first()).toBeVisible({
        timeout: 15_000,
      });

      expect(pageErrors).toEqual([]);
    });
  }
});
