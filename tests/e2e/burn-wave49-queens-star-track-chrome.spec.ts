/**
 * Wave 49 — Queens + Star-track mount/status chrome leftovers.
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

test.describe('Wave 49 — Queens & Guards chrome', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/queens-guards');
    await dismissModeIfNeeded(page);
  });

  test('board SVG + Escape help', async ({ page }) => {
    await expect(page.locator('.qg-board-container svg, svg[viewBox]').first()).toBeVisible({
      timeout: 10000,
    });
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.keyboard.press('Escape');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
    await expect(page.locator('.qg-board-container svg, svg[viewBox]').first()).toBeVisible();
  });
});

test.describe('Wave 49 — Star Track chrome', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/star-track');
    await dismissModeIfNeeded(page);
  });

  test('board + draw chrome + Escape help', async ({ page }) => {
    await expect(page.locator('.star-track-board, .star-track-wrapper').first()).toBeVisible({
      timeout: 10000,
    });
    await expect(
      page.locator('.star-track-draw-btn, .star-track-status, .star-track-chain-area').first()
    ).toBeVisible();
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.keyboard.press('Escape');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
    await expect(page.locator('.star-track-board, .star-track-wrapper').first()).toBeVisible();
  });
});
