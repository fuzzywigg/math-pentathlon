/**
 * Wave 39 — Fraction Pinball choice→scores chrome deepen leftovers.
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

test.describe('Wave 39 — Fraction Pinball choice scores', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/fraction-pinball');
    await dismissModeIfNeeded(page);
  });

  test('challenge + choice; answer shows result/scores', async ({ page }) => {
    await expect(
      page.locator('.pinball-challenge, .pinball-choice-btn, .pinball-board').first()
    ).toBeVisible();
    await expect(page.locator('.pinball-choice-btn').first()).toBeVisible();
    await page.locator('.pinball-choice-btn').first().click({ force: true });
    await expect(
      page
        .locator(
          '.pinball-result, .pinball-feedback, .pinball-scores, .pinball-continue-btn'
        )
        .first()
    ).toBeVisible({ timeout: 8000 });
  });

  test('new-game remounts choice chrome', async ({ page }) => {
    await page.locator('.pinball-choice-btn').first().click({ force: true });
    await page.click('#new-game-btn');
    await dismissModeIfNeeded(page);
    await expect(
      page.locator('.pinball-choice-btn, .pinball-board, .pinball-scores').first()
    ).toBeVisible();
  });

  test('help modal round-trip', async ({ page }) => {
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.click('#help-modal .modal-close');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
  });
});
