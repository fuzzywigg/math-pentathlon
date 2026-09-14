/**
 * Overnight HEAVY leftover after #229 — prime/frac/pent board-ui chrome (help Escape).
 * Distinct from #231 demos and #233 contig/SD/star/kings/queens/fiar.
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
  { id: 'prime-gold', sel: '.pg-board, .pg-roll-btn, .pg-board-container' },
  { id: 'frac-fact', sel: '.frac-problem, .frac-choice-btn, .frac-scores' },
  { id: 'pent-em-in', sel: '.pent-board, .pent-piece-selector, .pent-piece-option' },
] as const) {
  test.describe(`Wave 50 — ${game.id} board-ui chrome`, () => {
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
