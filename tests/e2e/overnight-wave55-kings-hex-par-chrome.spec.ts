/**
 * Wave 55 — chrome remount leftovers for kings / hex / hex-a-gone / stars / par / kwatro
 * after #250. Distinct from wave51 board selectors and wave52 kings cell-king remount.
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
    sel: '.status-supplies, .status-turn, .move-history-title',
  },
  { id: 'hex', sel: '.hex-legend, .hex-legend-p1, .hex-move-count' },
  {
    id: 'hex-a-gone',
    sel: '.hex-a-gone-bank-title, .hex-a-gone-coverage, .hex-a-gone-players',
  },
  { id: 'stars-bars', sel: '.stars-scores, .stars-hand-label, .stars-move-history' },
  { id: 'par-55', sel: '.par55-scores, .par55-target, .par55-history' },
  { id: 'kwatro-sinko', sel: '.kwa-chip-info, .kwa-player-info, .kwa-history' },
] as const;

for (const game of leftovers) {
  test.describe(`Wave 55 — ${game.id} leftover chrome`, () => {
    test('help Escape keeps status/history chrome mounted', async ({ page }) => {
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
