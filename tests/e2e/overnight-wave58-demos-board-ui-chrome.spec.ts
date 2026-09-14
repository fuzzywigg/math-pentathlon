/**
 * Wave 58 leftover after #267 — demos + queens/pent/prime residual chrome.
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

test.describe('Wave 58 leftover — dice h1 chrome', () => {
  test('exact Dice System Demo h1 on /demo/dice', async ({ page }) => {
    await page.goto('/#/demo/dice');
    await expect(page.locator('h1')).toHaveText(/Dice System Demo/);
    await expect(page.locator('.back-link')).toContainText(/Back to Games/);
  });
});

test.describe('Wave 58 leftover — align potential chrome', () => {
  test('potential idle + h3 catalog on /demo/alignment', async ({ page }) => {
    await page.goto('/#/demo/alignment');
    await expect(page.locator('h1')).toContainText(/Alignment Detection Demo/);
    await expect(page.locator('#potential-info')).toContainText(
      /Click a cell to see alignment potential/
    );
    await expect(page.getByRole('heading', { name: /Connect Four Style/ })).toBeVisible();
  });
});

for (const game of [
  { id: 'queens-guards', sel: '[data-cell-key], .qg-board-container, svg[role]' },
  { id: 'pent-em-in', sel: '.pent-board, .pent-piece-selector, .interaction' },
  { id: 'prime-gold', sel: '.pg-board, .pg-board-container, .pg-cell' },
] as const) {
  test.describe(`Wave 58 leftover — ${game.id} residual chrome`, () => {
    test('help Escape keeps residual board chrome', async ({ page }) => {
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
