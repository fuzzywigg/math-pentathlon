
/**
 * Wave 49 leftover after #221/#226/#227 — FIAR/kings/star-track/hexagone Escape-help chrome.
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
  { id: 'fiar', sel: '.fiar-board, svg, [data-node-id]' },
  { id: 'kings-quadraphages', sel: '.board .cell, .board' },
  { id: 'star-track', sel: '.star-track-goal, .star-track-status, svg' },
  { id: 'hex-a-gone', sel: '.hex-a-gone-board, .hex-a-gone-cell, svg' },
] as const) {
  test.describe(`Wave 49 — ${game.id} Escape chrome`, () => {
    test('help open/close via Escape', async ({ page }) => {
      await page.goto(`/#/game/${game.id}`);
      await dismissModeIfNeeded(page);
      await expect(page.locator(game.sel).first()).toBeVisible({ timeout: 10000 });
      await page.click('#help-btn');
      await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
      await page.keyboard.press('Escape');
      await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
      await expect(page.locator('#new-game-btn')).toBeVisible();
    });
  });
}
