/**
 * Wave 42 leftovers D — e2e chrome for hex-a-gone, stars-bars, ramrod.
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

test.describe('Wave 42 D — Hex-a-Gone chrome', () => {
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

test.describe('Wave 42 D — Stars & Bars chrome', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/stars-bars');
    await dismissModeIfNeeded(page);
  });

  test('title and board visible', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Stars & Bars');
    await expect(page.locator('.stars-board')).toBeVisible({
      timeout: 10000,
    });
    await expect(page.locator('.stars-card').first()).toBeVisible();
  });
});

test.describe('Wave 42 D — Ramrod chrome', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/ramrod');
    await dismissModeIfNeeded(page);
  });

  test('title and board visible', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Ramrod');
    await expect(page.locator('.ramrod-board')).toBeVisible({
      timeout: 10000,
    });
  });
});
