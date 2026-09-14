/**
 * Wave 57 leftover after #267 — demos + queens/sum/pent/prime residual chrome.
 * Distinct from wave56 quick-roll / attr tip leftovers. Existing selectors only.
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

test.describe('Wave 57 leftover — graph Path found chrome', () => {
  test('two pathfinding nodes paint Path found on /demo/graph', async ({
    page,
  }) => {
    await page.goto('/#/demo/graph');
    await expect(page.locator('h1')).toContainText(/Graph/i);
    await expect(page.locator('#path-status')).toHaveText(
      'Click a node to set start point'
    );
    const nodes = page.locator('#pathfinding-graph .graph-node');
    await expect(nodes.first()).toBeVisible({ timeout: 8000 });
    await nodes.nth(0).click();
    await nodes.nth(1).click();
    await expect(page.locator('#path-result strong')).toHaveText('Path found!');
  });
});

test.describe('Wave 57 leftover — expr True bang chrome', () => {
  test('2+2=4 paints True! Both sides equal on /demo/expression', async ({
    page,
  }) => {
    await page.goto('/#/demo/expression');
    await expect(page.locator('h1')).toContainText(/Expression/i);
    await page.locator('#equation-input').fill('2 + 2 = 4');
    await page.locator('#check-equation-btn').click();
    await expect(page.locator('#equation-result')).toHaveText(
      '✓ True! Both sides equal 4'
    );
  });
});

for (const game of [
  { id: 'queens-guards', sel: '.qg-board-container, .qg-status, svg[role]' },
  { id: 'sum-dominoes', sel: '.sd-board, .sd-hand-label, .sd-dice-area' },
  { id: 'pent-em-in', sel: '.pent-board, .pent-piece-selector' },
  { id: 'prime-gold', sel: '.pg-board, .pg-board-container, .pg-move-history' },
] as const) {
  test.describe(`Wave 57 leftover — ${game.id} residual chrome`, () => {
    test('help Escape keeps residual board chrome', async ({ page }) => {
      await page.goto(`/#/game/${game.id}`);
      await dismissModeIfNeeded(page);
      await expect(page.locator(game.sel).first()).toBeVisible({
        timeout: 10000,
      });
      await page.click('#help-btn');
      await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
      await page.keyboard.press('Escape');
      await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
      await expect(page.locator(game.sel).first()).toBeVisible();
    });
  });
}
