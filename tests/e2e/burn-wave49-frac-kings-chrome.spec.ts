/**
 * Wave 49 — Frac-fact + Kings mount/status chrome leftovers.
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

test.describe('Wave 49 — Frac Fact chrome', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/frac-fact');
    await dismissModeIfNeeded(page);
  });

  test('problem/scores chrome + Escape help', async ({ page }) => {
    await expect(
      page.locator('.frac-problem, .frac-scores, .frac-choices, .frac-game-container').first()
    ).toBeVisible({ timeout: 10000 });
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.keyboard.press('Escape');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
    await expect(
      page.locator('.frac-problem, .frac-scores, .frac-game-container').first()
    ).toBeVisible();
  });
});

test.describe('Wave 49 — Kings Quadraphages chrome', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/kings-quadraphages');
    await dismissModeIfNeeded(page);
  });

  test('board cells + status + Escape help', async ({ page }) => {
    await expect(page.locator('.board .cell, .cell').first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator('.status, .status-turn, .status-supplies').first()).toBeVisible();
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.keyboard.press('Escape');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
    await expect(page.locator('.board .cell, .cell').first()).toBeVisible();
  });
});
