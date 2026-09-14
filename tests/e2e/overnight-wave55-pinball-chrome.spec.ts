/**
 * Overnight TOKENMAXX HEAVY leftovers after #250 — fraction-pinball chrome (choice count + continue).
 * Distinct from wave54 help Escape. Tests-only.
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

test.describe('Wave 55 — fraction-pinball leftover chrome', () => {
  test('four choices then continue remounts challenge leftover', async ({ page }) => {
    await page.goto('/#/game/fraction-pinball');
    await dismissModeIfNeeded(page);
    await expect(page.locator('.pinball-choice-btn').first()).toBeVisible({
      timeout: 10000,
    });
    await expect(page.locator('.pinball-choice-btn')).toHaveCount(4);
    await expect(page.locator('.pinball-round-label')).toBeVisible();
    await page.locator('.pinball-choice-btn').first().click({ force: true });
    await expect(page.locator('.pinball-continue-btn')).toBeVisible({ timeout: 8000 });
    await page.locator('.pinball-continue-btn').click();
    await expect(
      page.locator('.pinball-choice-btn, .pinball-game-over, .pinball-winner-banner').first()
    ).toBeVisible();
    await expect(page.locator('.pinball-scores')).toBeVisible();
  });
});
