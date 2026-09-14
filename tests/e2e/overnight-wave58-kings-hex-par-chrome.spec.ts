/**
 * Wave 58 — inject/CSS chrome remount leftovers for kings / hex / hex-a-gone / par
 * after tip. Distinct from wave57 status/bank selectors. Existing selectors only.
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
    sel: '.board, .cell-king, .status-turn',
  },
  { id: 'hex', sel: '.hex-board, .hex-legend-p1, .status-turn' },
  {
    id: 'hex-a-gone',
    sel: '.hex-a-gone-board, .hex-a-gone-bank, .hex-a-gone-cell',
  },
  {
    id: 'par-55',
    sel: '.par55-board, .par55-scores, .par55-hand-player1',
  },
] as const;

for (const game of leftovers) {
  test.describe(`Wave 58 — ${game.id} inject CSS leftover chrome`, () => {
    test('help Escape keeps inject/CSS chrome mounted', async ({ page }) => {
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
