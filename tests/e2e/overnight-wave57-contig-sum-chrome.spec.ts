/**
 * Wave 57 leftover after #267 — contig-60 × sum-dominoes residual chrome.
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
  {
    id: 'contig-60',
    sel: '.contig-board, .contig-dice-area, .contig-scores, .contig-status',
  },
  {
    id: 'sum-dominoes',
    sel: '.sd-board, .sd-hand-label, .sd-dice-area, .sd-status',
  },
] as const) {
  test.describe(`Wave 57 leftover — ${game.id} residual chrome`, () => {
    test('help Escape keeps residual board/status chrome', async ({ page }) => {
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
