/**
 * Wave 49 — Queens + FIAR board chrome leftovers after #227/#225/#226.
 * Distinct from wave48 juggle/ramrod/remainder/pinball. Existing selectors only.
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

test.describe('Wave 49 — Queens guards chrome', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/queens-guards');
    await dismissModeIfNeeded(page);
  });

  test('board svg + Escape help', async ({ page }) => {
    await expect(page.locator('.qg-board-container, svg, [data-cell-key]').first()).toBeVisible({
      timeout: 10000,
    });
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.keyboard.press('Escape');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
    await expect(page.locator('.qg-board-container, svg').first()).toBeVisible();
  });
});

test.describe('Wave 49 — FIAR chrome', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/fiar');
    await dismissModeIfNeeded(page);
  });

  test('board nodes + Escape help', async ({ page }) => {
    await expect(page.locator('.fiar-board-container, svg, [data-node-id]').first()).toBeVisible({
      timeout: 10000,
    });
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.keyboard.press('Escape');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
    await expect(page.locator('.fiar-board-container, svg').first()).toBeVisible();
  });
});
