/**
 * Wave 41 — Star Track draw→select chrome deepen leftovers.
 * Existing selectors only. Tests-only.
 */
import { test, expect, Page } from '@playwright/test';

async function dismissModeIfNeeded(page: Page) {
  const modal = page.locator('#new-game-modal');
  if (await modal.isVisible().catch(() => false)) {
    const start = page.locator('#start-game-btn');
    if (await start.isVisible().catch(() => false)) {
      await start.click();
    }
  }
}

test.describe('Wave 41 — Star Track chain cycle', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/star-track');
    await dismissModeIfNeeded(page);
  });

  test('three draw→select loops keep draw CTA and pieces', async ({ page }) => {
    await expect(page.locator('.star-track-board')).toBeVisible();
    await expect(page.locator('.star-track-piece-p1')).toBeVisible();
    await expect(page.locator('.star-track-piece-p2')).toBeVisible();

    for (let i = 0; i < 3; i++) {
      await expect(page.locator('.star-track-draw-btn')).toBeVisible();
      await page.locator('.star-track-draw-btn').click();
      await expect(page.locator('.star-track-chain-btn')).toHaveCount(2);
      await page.locator('.star-track-chain-btn').nth(i % 2).click();
    }

    await expect(page.locator('.star-track-draw-btn')).toBeVisible();
    await expect(
      page.locator('.star-track-progress, .star-track-status, .status-turn').first()
    ).toBeVisible();
  });

  test('new-game remounts draw CTA mid-select', async ({ page }) => {
    await page.locator('.star-track-draw-btn').click();
    await expect(page.locator('.star-track-chain-btn')).toHaveCount(2);
    await page.click('#new-game-btn');
    await dismissModeIfNeeded(page);
    await expect(page.locator('.star-track-board')).toBeVisible();
    await expect(page.locator('.star-track-draw-btn')).toBeVisible();
  });

  test('help modal opens and closes', async ({ page }) => {
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.click('#help-modal .modal-close');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
  });
});
