/**
 * Wave 49 — Kwatro + Par55 board chrome leftovers after #227/#225/#226.
 * Distinct from wave48 calla/juggle/ramrod. Existing selectors only.
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

test.describe('Wave 49 — Kwatro sinko chrome', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/kwatro-sinko');
    await dismissModeIfNeeded(page);
  });

  test('board + chip info + Escape help', async ({ page }) => {
    await expect(page.locator('.kwa-board, .kwa-game-area, svg').first()).toBeVisible({
      timeout: 10000,
    });
    await expect(page.locator('.kwa-chip-info, .kwa-player-info').first()).toBeVisible();
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.keyboard.press('Escape');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
  });
});

test.describe('Wave 49 — Par 55 chrome', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/par-55');
    await dismissModeIfNeeded(page);
  });

  test('scores/hand chrome + Escape help', async ({ page }) => {
    await expect(
      page.locator('.par55-scores, .par55-hand, .par55-board, svg').first()
    ).toBeVisible({ timeout: 10000 });
    await expect(page.locator('.par55-target, .par55-scores').first()).toBeVisible();
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.keyboard.press('Escape');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
  });
});
