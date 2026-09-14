/**
 * Wave 48 — Remainder + Pinball mount/status chrome leftovers.
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

test.describe('Wave 48 — Remainder islands chrome', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/remainder-islands');
    await dismissModeIfNeeded(page);
  });

  test('board + scores + Escape help', async ({ page }) => {
    await expect(page.locator('.remainder-board, .island').first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator('.remainder-scores, .remainder-player-score').first()).toBeVisible();
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.keyboard.press('Escape');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
    await expect(page.locator('.remainder-board').first()).toBeVisible();
  });
});

test.describe('Wave 48 — Fraction pinball chrome', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/fraction-pinball');
    await dismissModeIfNeeded(page);
  });

  test('challenge/scores chrome + Escape help', async ({ page }) => {
    await expect(
      page.locator('.pinball-challenge, .pinball-scores, .pinball-board').first()
    ).toBeVisible({ timeout: 10000 });
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.keyboard.press('Escape');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
    await expect(
      page.locator('.pinball-challenge, .pinball-scores, .pinball-board').first()
    ).toBeVisible();
  });
});
