/**
 * Wave 40 — Kwatro + Calla + Ramrod chrome leftovers after #177.
 * Existing game chrome only. No product inventing.
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

test.describe('Wave 40 — Kwatro Sinko chrome leftovers', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/kwatro-sinko');
    await dismissModeIfNeeded(page);
  });

  test('board mounts; help open/close keeps shell', async ({ page }) => {
    await expect(page.locator('.kwa-board, .kwa-svg').first()).toBeVisible({
      timeout: 10000,
    });
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.click('#help-modal .modal-close');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
    await expect(page.locator('.kwa-board, #game-container').first()).toBeVisible();
  });

  test('new-game remount restores kwa board', async ({ page }) => {
    await expect(page.locator('.kwa-board').first()).toBeVisible({
      timeout: 10000,
    });
    await page.click('#new-game-btn');
    await dismissModeIfNeeded(page);
    await expect(page.locator('.kwa-board, .kwa-svg').first()).toBeVisible({
      timeout: 8000,
    });
  });
});

test.describe('Wave 40 — Calla chrome leftovers', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/calla');
    await dismissModeIfNeeded(page);
  });

  test('board + scores mount; help keeps pits', async ({ page }) => {
    await expect(page.locator('.calla-board, .calla-wrapper').first()).toBeVisible({
      timeout: 10000,
    });
    await expect(page.locator('.calla-scores, .calla-score').first()).toBeVisible();
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.click('#help-modal .modal-close');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
    await expect(page.locator('.calla-pit, .calla-board').first()).toBeVisible();
  });
});

test.describe('Wave 40 — Ramrod chrome leftovers', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/ramrod');
    await dismissModeIfNeeded(page);
  });

  test('board + rods mount; new-game remounts chrome', async ({ page }) => {
    await expect(page.locator('.ramrod-board, .ramrod-grid').first()).toBeVisible({
      timeout: 10000,
    });
    await expect(
      page.locator('.ramrod-player-rods, .ramrod-rod').first()
    ).toBeVisible();
    await page.click('#new-game-btn');
    await dismissModeIfNeeded(page);
    await expect(page.locator('.ramrod-board, .ramrod-grid').first()).toBeVisible({
      timeout: 8000,
    });
  });
});
