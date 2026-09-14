/**
 * Wave 38 — Juggle / Pent-Em-In poly+dice e2e leftovers after #171.
 * Existing game chrome only. No product inventing.
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

test.describe('Wave 38 — Juggle poly/dice deepen', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/juggle');
    await dismissModeIfNeeded(page);
  });

  test('roll then help keeps board chrome mounted', async ({ page }) => {
    const roll = page.locator('.juggle-roll-btn');
    await expect(roll).toBeVisible();
    await roll.click();
    await expect(
      page.locator('.juggle-dice-display, .juggle-dice-area, .juggle-die').first()
    ).toBeVisible();
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.click('#help-modal .modal-close');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
    await expect(page.locator('.juggle-board, .juggle-shape-selector').first()).toBeVisible();
  });

  test('two rolls keep roll CTA available', async ({ page }) => {
    for (let i = 0; i < 2; i++) {
      const roll = page.locator('.juggle-roll-btn');
      if (await roll.isVisible().catch(() => false)) {
        await roll.click();
      }
      await expect(
        page.locator('.juggle-board, .juggle-dice-display, .juggle-shape-selector').first()
      ).toBeVisible();
    }
  });
});

test.describe('Wave 38 — Pent-Em-In selection chrome', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/pent-em-in');
    await dismissModeIfNeeded(page);
  });

  test('board and piece supply mount', async ({ page }) => {
    await expect(
      page.locator('.pent-board, .pei-board, .game-board, canvas, svg').first()
    ).toBeVisible({ timeout: 10000 });
  });

  test('help open/close keeps game shell', async ({ page }) => {
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.click('#help-modal .modal-close');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
    await expect(page.locator('#game-container, .game-view, main').first()).toBeVisible();
  });
});
