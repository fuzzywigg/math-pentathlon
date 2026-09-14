/**
 * Wave 56 leftover after #256 — demos + queens/sum/pent/prime residual chrome.
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

test.describe('Wave 56 leftover — dice quick-roll chrome', () => {
  test('quick-roll placeholder then Roll 1d6 on /demo/dice', async ({ page }) => {
    await page.goto('/#/demo/dice');
    await expect(page.locator('h1')).toContainText(/Dice/i);
    await expect(page.locator('#quick-roll-result')).toContainText(
      /Click a button to roll/i
    );
    await expect(page.getByRole('button', { name: 'Roll 1d6' })).toBeVisible();
  });
});

test.describe('Wave 56 leftover — attr tip chrome', () => {
  test('valid-sets tip exposes ALL the same on /demo/attributes', async ({
    page,
  }) => {
    await page.goto('/#/demo/attributes');
    await expect(page.locator('h1')).toContainText(/Attribute/i);
    await expect(page.locator('#valid-sets-info')).toContainText(
      /ALL the same or ALL different/i
    );
    await expect(page.locator('#back-btn')).toBeVisible();
  });
});

for (const game of [
  { id: 'queens-guards', sel: '.qg-board-container, .qg-status, svg[role]' },
  { id: 'sum-dominoes', sel: '.sd-board, .sd-hand-label, .sd-dice-area' },
  { id: 'pent-em-in', sel: '.pent-board, .pent-piece-selector' },
  { id: 'prime-gold', sel: '.pg-board, .pg-board-container, .pg-move-history' },
] as const) {
  test.describe(`Wave 56 leftover — ${game.id} residual chrome`, () => {
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
