/**
 * Wave 55 leftover after #249/#250 — chrome remount for fab main-layout + FIAR board-container.
 * Distinct from wave53 bar/answer pools and wave54 scores/chips-info.
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

test.describe('Wave 55 — fab main-layout leftover', () => {
  test('help Escape keeps main-layout mounted', async ({ page }) => {
    await page.goto('/#/game/fab-a-diffy');
    await dismissModeIfNeeded(page);
    await expect(page.locator('.fab-main-layout').first()).toBeVisible({
      timeout: 10000,
    });
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.keyboard.press('Escape');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
    await expect(page.locator('.fab-main-layout').first()).toBeVisible();
  });
});

test.describe('Wave 55 — fiar board-container leftover', () => {
  test('help Escape keeps board-container mounted', async ({ page }) => {
    await page.goto('/#/game/fiar');
    await dismissModeIfNeeded(page);
    await expect(
      page.locator('.fiar-board-container, [data-node-id]').first()
    ).toBeVisible({ timeout: 10000 });
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.keyboard.press('Escape');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
    await expect(
      page.locator('.fiar-board-container, [data-node-id]').first()
    ).toBeVisible();
  });
});
