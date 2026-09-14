/**
 * Wave 42 leftovers B — Remainder Escape chrome deepen for leftovers B slice.
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

test.describe('Wave 42 — Remainder Escape chrome leftovers B', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/remainder-islands');
    await dismissModeIfNeeded(page);
  });

  test('roll → help Escape → roll again still works', async ({ page }) => {
    const roll = page.locator('.remainder-btn-roll');
    await expect(roll).toBeVisible({ timeout: 10000 });
    await roll.click();
    await expect(page.locator('.remainder-board')).toBeVisible();

    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.keyboard.press('Escape');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);

    await page.click('#new-game-btn');
    await dismissModeIfNeeded(page);
    await expect(page.locator('.remainder-btn-roll')).toBeVisible({
      timeout: 8000,
    });
    await page.locator('.remainder-btn-roll').click();
    await expect(page.locator('.remainder-board')).toBeVisible();
  });
});
