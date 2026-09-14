/**
 * Wave 56 leftover after #255/#256 — chrome remount for fab columns + FIAR status.
 * Distinct from wave54 scores/chips and wave55 main-layout/board-container.
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

test.describe('Wave 56 — fab left/right columns leftover', () => {
  test('help Escape keeps left/right columns mounted', async ({ page }) => {
    await page.goto('/#/game/fab-a-diffy');
    await dismissModeIfNeeded(page);
    await expect(page.locator('.fab-left-column').first()).toBeVisible({
      timeout: 10000,
    });
    await expect(page.locator('.fab-right-column').first()).toBeVisible();
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.keyboard.press('Escape');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
    await expect(page.locator('.fab-left-column').first()).toBeVisible();
    await expect(page.locator('.fab-right-column').first()).toBeVisible();
  });
});

test.describe('Wave 56 — fiar status leftover', () => {
  test('help Escape keeps fiar-status / chips-info mounted', async ({
    page,
  }) => {
    await page.goto('/#/game/fiar');
    await dismissModeIfNeeded(page);
    await expect(page.locator('.fiar-status').first()).toBeVisible({
      timeout: 10000,
    });
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.keyboard.press('Escape');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
    await expect(page.locator('.fiar-status').first()).toBeVisible();
  });
});
