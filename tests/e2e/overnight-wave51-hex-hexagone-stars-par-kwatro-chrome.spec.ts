/**
 * Wave 51 — chrome remount for hex / hex-a-gone / stars-bars / par-55 / kwatro leftovers.
 * Distinct from #234 prime/frac/pent and #233 contig/SD/star/kings/queens/fiar.
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

for (const game of [
  { id: 'hex', sel: '.hex-board, .hex-cell, .hex-status, #game-container' },
  { id: 'hex-a-gone', sel: '.hex-a-gone-wrapper, .hex-a-gone-board, .hex-a-gone-block-btn' },
  { id: 'stars-bars', sel: '.stars-board, .stars-cell, .stars-hand' },
  { id: 'par-55', sel: '.par55-board, .par55-hand, [data-base-id]' },
  { id: 'kwatro-sinko', sel: '.kwa-board, [data-node-id], .kwa-chip-info' },
] as const) {
  test.describe(`Wave 51 — ${game.id} chrome leftover`, () => {
    test('help Escape keeps board chrome mounted', async ({ page }) => {
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
