/**
 * Wave 57 leftover after #257 — chrome remount for fab/fiar status seats.
 * Distinct from wave56 left/right columns and fiar-status alone.
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
      await human
        .first()
        .check({ force: true })
        .catch(() => undefined);
    }
    const start = page.locator('#start-game-btn');
    if (await start.isVisible().catch(() => false)) {
      await start.click();
    }
  }
}

test.describe('Wave 57 — fab status seat leftover', () => {
  test('help Escape keeps .fab-status.player1 and game-area mounted', async ({
    page,
  }) => {
    await page.goto('/#/game/fab-a-diffy');
    await dismissModeIfNeeded(page);
    await expect(page.locator('.fab-status.player1').first()).toBeVisible({
      timeout: 10000,
    });
    await expect(page.locator('.fab-game-area').first()).toBeVisible();
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.keyboard.press('Escape');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
    await expect(page.locator('.fab-status.player1').first()).toBeVisible();
    await expect(page.locator('.fab-game-area').first()).toBeVisible();
  });
});

test.describe('Wave 57 — fiar status seat + chip icon leftover', () => {
  test('help Escape keeps .fiar-status.player1 and chip-icon mounted', async ({
    page,
  }) => {
    await page.goto('/#/game/fiar');
    await dismissModeIfNeeded(page);
    await expect(page.locator('.fiar-status.player1').first()).toBeVisible({
      timeout: 10000,
    });
    await expect(page.locator('.fiar-chip-icon').first()).toBeVisible();
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.keyboard.press('Escape');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
    await expect(page.locator('.fiar-status.player1').first()).toBeVisible();
    await expect(page.locator('.fiar-chip-icon').first()).toBeVisible();
  });
});
