/**
 * Wave 41 HEAVY — e2e chrome for ramrod + prime-gold.
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

test.describe('Wave 41 — Ramrod chrome', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/ramrod');
    await dismissModeIfNeeded(page);
  });

  test('title and board visible', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Ramrod');
    await expect(page.locator('.ramrod-board')).toBeVisible({ timeout: 10000 });
  });

  test('scores/history/controls chrome present', async ({ page }) => {
    await expect(
      page.locator('.ramrod-scores, .ramrod-history, .ramrod-controls').first()
    ).toBeVisible({ timeout: 8000 });
  });
});

test.describe('Wave 41 — Prime Gold chrome', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/prime-gold');
    await dismissModeIfNeeded(page);
  });

  test('title, board, and roll CTA visible', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Prime Gold');
    await expect(page.locator('.pg-board')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('.pg-roll-btn')).toBeVisible();
  });

  test('roll reveals dice; help keeps shell', async ({ page }) => {
    await page.locator('.pg-roll-btn').click();
    await expect(
      page.locator('.pg-dice-container .pg-die, .pg-die').first()
    ).toBeVisible({ timeout: 8000 });
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.click('#help-modal .modal-close');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
    await expect(
      page.locator('.pg-board, .pg-roll-btn, #game-container').first()
    ).toBeVisible();
  });
});
