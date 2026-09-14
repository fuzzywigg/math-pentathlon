/**
 * Wave 48 — Juggle + Ramrod Escape/help chrome leftovers.
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

test.describe('Wave 48 — Juggle Escape help chrome', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/juggle');
    await dismissModeIfNeeded(page);
  });

  test('roll CTA → Escape help → dice area remounts', async ({ page }) => {
    const roll = page.locator('.juggle-roll-btn');
    await expect(roll).toBeVisible({ timeout: 10000 });
    await roll.click();
    await expect(page.locator('.juggle-dice-display, .juggle-die').first()).toBeVisible();
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.keyboard.press('Escape');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
    await expect(page.locator('.juggle-board, .juggle-dice-area').first()).toBeVisible();
  });
});

test.describe('Wave 48 — Ramrod Escape help chrome', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/ramrod');
    await dismissModeIfNeeded(page);
  });

  test('board + scores → Escape help → chrome stays', async ({ page }) => {
    await expect(page.locator('.ramrod-board, .ramrod-box').first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator('.ramrod-scores, .ramrod-score').first()).toBeVisible();
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.keyboard.press('Escape');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
    await expect(page.locator('.ramrod-board, .ramrod-player-rods').first()).toBeVisible();
  });
});
