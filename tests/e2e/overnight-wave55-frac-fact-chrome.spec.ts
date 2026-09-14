/**
 * Overnight TOKENMAXX HEAVY leftovers after #250 — frac-fact chrome (choice count + continue).
 * Distinct from wave41 result click and wave52 help Escape. Tests-only.
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

test.describe('Wave 55 — frac-fact leftover chrome', () => {
  test('four choices then continue remounts problem leftover', async ({ page }) => {
    await page.goto('/#/game/frac-fact');
    await dismissModeIfNeeded(page);
    await expect(page.locator('.frac-choice-btn').first()).toBeVisible({
      timeout: 10000,
    });
    await expect(page.locator('.frac-choice-btn')).toHaveCount(4);
    await expect(page.locator('.frac-progress-text')).toBeVisible();
    await page.locator('.frac-choice-btn').first().click({ force: true });
    await expect(page.locator('.frac-continue-btn')).toBeVisible({ timeout: 8000 });
    await page.locator('.frac-continue-btn').click();
    await expect(
      page.locator('.frac-choice-btn, .frac-game-over, .frac-winner-banner').first()
    ).toBeVisible();
    await expect(page.locator('.frac-scores')).toBeVisible();
  });
});
