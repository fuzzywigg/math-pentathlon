/**
 * Wave 47 leftover after #214/#215 — new-game remount for stars/sum/par.
 * Existing selectors only. Tests-only.
 */
import { test, expect, Page } from '@playwright/test';

async function dismissModeIfNeeded(page: Page) {
  const modal = page.locator('#new-game-modal');
  if (await modal.isVisible().catch(() => false)) {
    const start = page.locator('#start-game-btn');
    if (await start.isVisible().catch(() => false)) await start.click();
  }
}

for (const id of ['stars-bars', 'sum-dominoes', 'par-55'] as const) {
  test.describe(`Wave 47 — ${id} new-game remount`, () => {
    test('new-game keeps container mounted', async ({ page }) => {
      await page.goto(`/#/game/${id}`);
      await dismissModeIfNeeded(page);
      await expect(page.locator('#game-container, main').first()).toBeVisible({
        timeout: 10000,
      });
      await page.click('#new-game-btn');
      await dismissModeIfNeeded(page);
      await expect(page.locator('#game-container, main').first()).toBeVisible();
    });
  });
}
