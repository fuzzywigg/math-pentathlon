/**
 * Wave 56 — chrome remount leftovers for kings / hex / hex-a-gone / par / kwatro
 * after #256. Distinct from wave55 status/history selectors. Existing selectors only.
 * Tests-only.
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
    sel: '.board[role="grid"], .cell-king, .status-turn',
  },
  { id: 'hex', sel: '.hex-legend-p1, .status-turn, .hex-move-count' },
  {
    id: 'hex-a-gone',
    sel: '.hex-a-gone-coverage, .hex-a-gone-block-btn, .status-turn',
  },
  { id: 'par-55', sel: '.par55-score.player1, .par55-target, .par55-hand' },
  { id: 'kwatro-sinko', sel: '.kwa-svg, [data-node-id], .kwa-chip-info' },
] as const;

for (const game of leftovers) {
  test.describe(`Wave 56 — ${game.id} leftover chrome`, () => {
    test('help Escape keeps residual chrome mounted', async ({ page }) => {
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
