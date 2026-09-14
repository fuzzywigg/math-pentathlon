/**
 * Wave 39 — Frac Fact choice→result chrome deepen leftovers.
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

test.describe('Wave 39 — Frac Fact choice result', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/frac-fact');
    await dismissModeIfNeeded(page);
  });

  test('problem + choices visible; answer yields feedback/scores', async ({
    page,
  }) => {
    await expect(page.locator('.frac-problem, .frac-choice-btn').first()).toBeVisible();
    await expect(page.locator('.frac-choice-btn').first()).toBeVisible();
    await page.locator('.frac-choice-btn').first().click({ force: true });
    await expect(
      page.locator('.frac-result, .frac-feedback, .frac-scores').first()
    ).toBeVisible({ timeout: 8000 });
  });

  test('multi-answer cycle keeps choice chrome', async ({ page }) => {
    for (let i = 0; i < 2; i++) {
      const choice = page.locator('.frac-choice-btn').first();
      if (await choice.isVisible().catch(() => false)) {
        await choice.click({ force: true });
      }
      const cont = page.locator(
        '.frac-continue-btn, .frac-next-btn, button:has-text("Next"), button:has-text("Continue")'
      );
      if (await cont.first().isVisible().catch(() => false)) {
        await cont.first().click();
      }
    }
    await expect(
      page.locator('.frac-choice-btn, .frac-problem, .frac-scores').first()
    ).toBeVisible();
  });

  test('help modal round-trip', async ({ page }) => {
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.click('#help-modal .modal-close');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
  });
});
