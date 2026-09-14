/**
 * Wave 57 leftover after #262 — calla/juggle/ramrod chrome remount.
 * Distinct from wave56 wrapper/status/hand selectors. Existing only.
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

test.describe('Wave 57 — calla leftover chrome', () => {
  test('arrowhead + store seat icons remount after help Escape', async ({
    page,
  }) => {
    await page.goto('/#/game/calla');
    await dismissModeIfNeeded(page);
    await expect(page.locator('.calla-wrapper')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('#arrowhead-p1')).toBeAttached();
    await expect(page.locator('.calla-store-label').first()).toContainText('🔵');
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.keyboard.press('Escape');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
    await expect(page.locator('#arrowhead-p1')).toBeAttached();
    await expect(page.locator('.calla-store-label').first()).toContainText('🔵');
  });
});

test.describe('Wave 57 — juggle leftover chrome', () => {
  test('Roll Dice exact + status remount after help Escape', async ({ page }) => {
    await page.goto('/#/game/juggle');
    await dismissModeIfNeeded(page);
    await expect(page.locator('.juggle-roll-btn')).toBeVisible({
      timeout: 10000,
    });
    await expect(page.locator('.juggle-roll-btn')).toHaveText('Roll Dice');
    await expect(page.locator('.juggle-status').first()).toBeVisible();
    await page.click('#help-btn');
    await page.keyboard.press('Escape');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
    await expect(page.locator('.juggle-roll-btn')).toHaveText('Roll Dice');
  });
});

test.describe('Wave 57 — ramrod leftover chrome', () => {
  test('Goal: 24cm + hand seat icons remount after help Escape', async ({
    page,
  }) => {
    await page.goto('/#/game/ramrod');
    await dismissModeIfNeeded(page);
    await expect(page.locator('.ramrod-target')).toHaveText('Goal: 24cm', {
      timeout: 10000,
    });
    await expect(page.locator('.ramrod-hand-label.player1')).toContainText('🔵');
    await page.click('#help-btn');
    await page.keyboard.press('Escape');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
    await expect(page.locator('.ramrod-target')).toHaveText('Goal: 24cm');
    await expect(page.locator('.ramrod-hand-label.player2')).toContainText('🔴');
  });
});
