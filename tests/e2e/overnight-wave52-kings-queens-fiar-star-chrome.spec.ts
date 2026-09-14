/**
 * Wave 52 — Escape remount chrome for kings / queens / fiar / star-track leftovers.
 * Distinct from #235/#236 hex/par/stars-bars Escape niches. Existing selectors only.
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
  {
    id: 'kings-quadraphages',
    board: '.board.phase-moveKing, .cell-king, #game-container',
  },
  {
    id: 'queens-guards',
    board: 'svg [data-cell-key="0-0"], #game-container',
  },
  {
    id: 'fiar',
    board: 'svg [data-node-id], #game-container',
  },
  {
    id: 'star-track',
    board: '.star-track-draw-btn, .star-track-board, #game-container',
  },
] as const) {
  test.describe(`Wave 52 — ${game.id} chrome leftover`, () => {
    test('help Escape keeps residual chrome mounted', async ({ page }) => {
      await page.goto(`/#/game/${game.id}`);
      await dismissModeIfNeeded(page);
      await expect(page.locator(game.board).first()).toBeVisible({
        timeout: 10000,
      });
      await page.click('#help-btn');
      await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
      await page.keyboard.press('Escape');
      await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
      await expect(page.locator(game.board).first()).toBeVisible();
    });
  });
}
