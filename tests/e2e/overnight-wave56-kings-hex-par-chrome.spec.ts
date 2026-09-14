/**
 * Wave 56 — chrome remount leftovers for kings / hex / hex-a-gone / stars / par / kwatro
 * after #256. Distinct from wave55 status/history selectors: bank / scores / target / board.
 * Existing selectors only. Tests-only.
 */
import { test, expect, Page } from '@playwright/test';

async function dismissModeIfNeeded(page: Page) {
  const modal = page.locator('#new-game-modal');
  if (await modal.isVisible().catch(() => false)) {
    const human = page.locator(
      'input[value="human-vs-human"], input[value="vs-human"]'
    );
    if (await human.count()) {
      await human.first().check({ force: true }).catch(() => undefined);
    }
    const start = page.locator('#start-game-btn');
    if (await start.isVisible().catch(() => false)) {
      await start.click();
    }
  }
}

const leftovers = [
  {
    id: 'kings-quadraphages',
    sel: '.board, .supply-p1, .cell-king',
  },
  { id: 'hex', sel: '.hex-board, .hex-status, .status-turn' },
  {
    id: 'hex-a-gone',
    sel: '.hex-a-gone-bank, .hex-a-gone-block-btn, .status-turn',
  },
  { id: 'stars-bars', sel: '.stars-board, .stars-status, .stars-hand' },
  { id: 'par-55', sel: '.par55-board, .par55-status, .par55-hand' },
  { id: 'kwatro-sinko', sel: '.kwa-board, .kwa-status, .kwa-target-info' },
] as const;

for (const game of leftovers) {
  test.describe(`Wave 56 — ${game.id} leftover chrome`, () => {
    test('help Escape keeps board/status chrome mounted', async ({ page }) => {
      await page.goto(`/#/game/${game.id}`);
      await dismissModeIfNeeded(page);
      await expect(page.locator(game.sel).first()).toBeVisible({ timeout: 10000 });
      await page.click('#help-btn');
      await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
      await page.keyboard.press('Escape');
      await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
      await expect(page.locator(game.sel).first()).toBeVisible();
    });
  });
}
