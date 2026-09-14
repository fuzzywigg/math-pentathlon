/**
 * Wave 48 — e2e chrome for leftover engines: calla / juggle / ramrod.
 * Distinct from #220 demos, #221 wave47 leftovers, #222 dice/frac, #224 graph/hex.
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

test.describe('Wave 48 — calla/juggle/ramrod leftover chrome', () => {
  test('calla pit click + help Escape keeps board', async ({ page }) => {
    await page.goto('/#/game/calla');
    await dismissModeIfNeeded(page);
    await expect(page.locator('.calla-board, .calla-wrapper, svg').first()).toBeVisible({
      timeout: 10000,
    });
    const pit = page.locator('.calla-pit, [data-pit], .calla-board circle').first();
    if (await pit.isVisible().catch(() => false)) {
      await pit.click({ force: true });
    }
    await expect(
      page.locator('.calla-scores, .calla-status, .calla-board').first()
    ).toBeVisible();
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.keyboard.press('Escape');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
  });

  test('juggle roll CTA then help remount', async ({ page }) => {
    await page.goto('/#/game/juggle');
    await dismissModeIfNeeded(page);
    await expect(
      page.locator('.juggle-board, .juggle-roll-btn, .juggle-dice, canvas, svg').first()
    ).toBeVisible({ timeout: 10000 });
    const roll = page.locator(
      '.juggle-roll-btn, button:has-text("Roll"), #roll-btn'
    );
    if (await roll.first().isVisible().catch(() => false)) {
      await roll.first().click();
      await expect(
        page
          .locator('.juggle-dice, .juggle-shapes, .juggle-board, .juggle-die')
          .first()
      ).toBeVisible({ timeout: 8000 });
    }
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.click('#help-modal .modal-close');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
  });

  test('ramrod rod select chrome + new-game remount', async ({ page }) => {
    await page.goto('/#/game/ramrod');
    await dismissModeIfNeeded(page);
    await expect(page.locator('.ramrod-board, .ramrod-grid, .ramrod-rods').first()).toBeVisible({
      timeout: 10000,
    });
    const rod = page.locator('.ramrod-rod, .player-rod, [data-rod-id]').first();
    if (await rod.isVisible().catch(() => false)) {
      await rod.click({ force: true });
    }
    await expect(
      page.locator('.ramrod-board, .ramrod-scores, .ramrod-grid').first()
    ).toBeVisible();
    await page.click('#new-game-btn');
    await dismissModeIfNeeded(page);
    await expect(page.locator('.ramrod-board, .ramrod-grid').first()).toBeVisible({
      timeout: 8000,
    });
  });
});
