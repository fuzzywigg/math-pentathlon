/**
 * Wave 41 HEAVY — e2e chrome for hex-a-gone, calla, queens-guards.
 * Existing selectors only. No product inventing.
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

test.describe('Wave 41 — Hex-a-Gone chrome', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/hex-a-gone');
    await dismissModeIfNeeded(page);
  });

  test('title and board visible', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Hex-a-Gone');
    await expect(page.locator('.hex-a-gone-board')).toBeVisible({
      timeout: 10000,
    });
  });

  test('bank block CTA present', async ({ page }) => {
    await expect(
      page.locator('.hex-a-gone-block-btn:not(.empty)').first()
    ).toBeVisible({ timeout: 8000 });
  });
});

test.describe('Wave 41 — Calla chrome', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/calla');
    await dismissModeIfNeeded(page);
  });

  test('title, board, and status visible', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Calla');
    await expect(page.locator('.calla-board')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('.calla-status')).toBeVisible();
  });

  test('valid pits present at opening', async ({ page }) => {
    await expect(page.locator('.calla-pit-valid').first()).toBeVisible({
      timeout: 8000,
    });
  });
});

test.describe('Wave 41 — Queens & Guards chrome', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/queens-guards');
    await dismissModeIfNeeded(page);
  });

  test('title and board container visible', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Queens & Guards');
    await expect(page.locator('.qg-board-container')).toBeVisible({
      timeout: 10000,
    });
  });

  test('status chrome mounted', async ({ page }) => {
    await expect(page.locator('.qg-status')).toBeVisible({ timeout: 8000 });
  });
});
