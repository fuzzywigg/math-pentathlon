/**
 * Overnight HEAVY leftovers after #234 — hex + stars-bars Escape chrome.
 * Distinct from tip #234 prime/frac/pent, #233 contig/SD/star-track/fiar,
 * and #229 kwatro/par Escape. Existing selectors only. Tests-only.
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
  { id: 'hex', sel: '.hex-board, .hex-status, .hex-cell-group' },
  { id: 'stars-bars', sel: '.stars-board, .stars-cell, .stars-hand' },
] as const) {
  test.describe(`Wave 51 — ${game.id} leftover board-ui chrome`, () => {
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
