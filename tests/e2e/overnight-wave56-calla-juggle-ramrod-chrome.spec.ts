/**
 * Wave 56 leftover after #256 — calla/juggle/ramrod chrome remount.
 * Distinct from wave50/52 Escape help leftovers. Existing selectors only.
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

test.describe('Wave 56 — calla leftover chrome', () => {
  test('wrapper + store labels remount after help Escape', async ({ page }) => {
    await page.goto('/#/game/calla');
    await dismissModeIfNeeded(page);
    await expect(page.locator('.calla-wrapper')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('.calla-store-label').first()).toBeVisible();
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.keyboard.press('Escape');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
    await expect(page.locator('.calla-wrapper')).toBeVisible();
    await expect(page.locator('.calla-store-label').first()).toBeVisible();
  });
});

test.describe('Wave 56 — juggle leftover chrome', () => {
  test('roll CTA + status remount after help Escape', async ({ page }) => {
    await page.goto('/#/game/juggle');
    await dismissModeIfNeeded(page);
    await expect(page.locator('.juggle-roll-btn, .juggle-dice-area').first()).toBeVisible({
      timeout: 10000,
    });
    await expect(page.locator('.juggle-status').first()).toBeVisible();
    await page.click('#help-btn');
    await page.keyboard.press('Escape');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
    await expect(page.locator('.juggle-status').first()).toBeVisible();
  });
});

test.describe('Wave 56 — ramrod leftover chrome', () => {
  test('hand labels + select status remount after help Escape', async ({
    page,
  }) => {
    await page.goto('/#/game/ramrod');
    await dismissModeIfNeeded(page);
    await expect(page.locator('.ramrod-hand-label.player1')).toBeVisible({
      timeout: 10000,
    });
    await expect(page.locator('.ramrod-status')).toContainText(/Select a rod/);
    await page.click('#help-btn');
    await page.keyboard.press('Escape');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
    await expect(page.locator('.ramrod-hand-label.player2')).toBeVisible();
    await expect(page.locator('.ramrod-status')).toContainText(/Select a rod/);
  });
});
