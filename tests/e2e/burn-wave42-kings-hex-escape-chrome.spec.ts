/**
 * Wave 42 leftovers B — Kings + Hex Escape-help chrome leftovers.
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

test.describe('Wave 42 — Kings Escape help chrome', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/kings-quadraphages');
    await dismissModeIfNeeded(page);
  });

  test('board + supplies visible; Escape closes help; remount keeps board', async ({
    page,
  }) => {
    await expect(page.locator('.board, .cell').first()).toBeVisible({
      timeout: 10000,
    });
    await expect(page.locator('.supply-p1, .status-supplies').first()).toBeVisible();

    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.keyboard.press('Escape');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);

    await page.click('#new-game-btn');
    await dismissModeIfNeeded(page);
    await expect(page.locator('.board, .cell').first()).toBeVisible({
      timeout: 8000,
    });
  });
});

test.describe('Wave 42 — Hex Escape help chrome', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/hex');
    await dismissModeIfNeeded(page);
  });

  test('hex-board chrome survives Escape help + remount', async ({ page }) => {
    await expect(page.locator('.hex-board')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('.hex-status, .hex-legend').first()).toBeVisible();

    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.keyboard.press('Escape');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);

    await expect(page.locator('.hex-board')).toBeVisible();
    await page.click('#new-game-btn');
    await dismissModeIfNeeded(page);
    await expect(page.locator('.hex-board')).toBeVisible({ timeout: 8000 });
  });
});
