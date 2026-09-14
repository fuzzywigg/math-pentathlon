/**
 * Overnight HEAVY leftover after #234 — calla/juggle/ramrod board-ui chrome (help Escape).
 * Distinct from open #235/#236 hex niches and wave48 calla Escape / juggle close / ramrod new-game.
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
  { id: 'calla', sel: '.calla-board, .calla-wrapper, .calla-scores' },
  { id: 'juggle', sel: '.juggle-board, .juggle-roll-btn, .juggle-dice-area' },
  { id: 'ramrod', sel: '.ramrod-board, .ramrod-grid, .ramrod-scores' },
] as const) {
  test.describe(`Wave 52 — ${game.id} board-ui chrome`, () => {
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
