/**
 * Wave 57 — chrome remount leftovers for kings / hex / hex-a-gone / par / kwatro
 * after #263. Distinct from wave56 selectors. Existing selectors only.
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
    sel: '.cell-p2.cell-king, .cell[data-row="9"][data-col="5"], .status-turn',
  },
  { id: 'hex', sel: '.hex-legend-p2, .status-turn, .hex-board' },
  {
    id: 'hex-a-gone',
    sel: '[data-shape="trapezoid"], .hex-a-gone-bank, .status-turn',
  },
  {
    id: 'par-55',
    sel: '.par55-status, .par55-hand-label.player1, .par55-target',
  },
  {
    id: 'kwatro-sinko',
    sel: '.kwa-status, .kwa-target-info, .kwa-svg',
  },
] as const;

for (const game of leftovers) {
  test.describe(`Wave 57 — ${game.id} leftover chrome`, () => {
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
