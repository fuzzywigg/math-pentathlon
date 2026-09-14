/**
 * Wave 49 — chrome remount for contig / sum-dominoes / star-track / kings / queens / fiar leftovers.
 * Distinct from calla/juggle/ramrod drafts. Existing selectors only. Tests-only.
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
  { id: 'contig-60', board: '.contig-board, .contig-cell, #game-container' },
  { id: 'sum-dominoes', board: '.sd-board, .sd-hand, #game-container' },
  { id: 'star-track', board: '.star-track-board, .star-track-wrapper, #game-container' },
  { id: 'kings-quadraphages', board: '.board, .cell, #game-container' },
  { id: 'queens-guards', board: 'svg, [data-cell-key], #game-container' },
  { id: 'fiar', board: 'svg, [data-node-id], #game-container' },
] as const) {
  test.describe(`Wave 49 — ${game.id} chrome leftover`, () => {
    test('help open/close keeps board chrome mounted', async ({ page }) => {
      await page.goto(`/#/game/${game.id}`);
      await dismissModeIfNeeded(page);
      await expect(page.locator(game.board).first()).toBeVisible({
        timeout: 10000,
      });
      await page.click('#help-btn');
      await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
      await page.click('#help-modal .modal-close');
      await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
      await expect(page.locator(game.board).first()).toBeVisible();
    });
  });
}
