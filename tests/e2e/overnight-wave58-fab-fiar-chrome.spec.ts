/**
 * Wave 58 leftover after #271 — chrome remount for fab bar-pool / fiar chips-info.
 * Distinct from wave57 status-seat + chip-icon alone.
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

test.describe('Wave 58 — fab bar-pool inject chrome leftover', () => {
  test('help Escape keeps .fab-bar-pool and answer-board mounted', async ({
    page,
  }) => {
    await page.goto('/#/game/fab-a-diffy');
    await dismissModeIfNeeded(page);
    await expect(page.locator('.fab-bar-pool').first()).toBeVisible({
      timeout: 10000,
    });
    await expect(page.locator('.fab-answer-board').first()).toBeVisible();
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.keyboard.press('Escape');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
    await expect(page.locator('.fab-bar-pool').first()).toBeVisible();
    await expect(page.locator('.fab-answer-board').first()).toBeVisible();
  });
});

test.describe('Wave 58 — fiar chips-info inject chrome leftover', () => {
  test('help Escape keeps .fiar-chips-info and chip-icon height chrome', async ({
    page,
  }) => {
    await page.goto('/#/game/fiar');
    await dismissModeIfNeeded(page);
    await expect(page.locator('.fiar-chips-info').first()).toBeVisible({
      timeout: 10000,
    });
    await expect(page.locator('.fiar-chip-icon').first()).toBeVisible();
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.keyboard.press('Escape');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
    await expect(page.locator('.fiar-chips-info').first()).toBeVisible();
    await expect(page.locator('.fiar-chip-icon').first()).toBeVisible();
  });
});
