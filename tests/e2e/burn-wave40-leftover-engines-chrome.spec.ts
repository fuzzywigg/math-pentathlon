/**
 * Wave 40 — leftover engines chrome (calla / fab-a-diffy / juggle) after #178.
 * Existing game chrome only. No RNG assertions. No product inventing.
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

test.describe('Wave 40 — Calla chrome leftovers', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/calla');
    await dismissModeIfNeeded(page);
  });

  test('board mounts; help → new-game remounts chrome', async ({ page }) => {
    await expect(
      page.locator('.calla-board, .calla-pit').first()
    ).toBeVisible({ timeout: 10000 });
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.click('#help-modal .modal-close');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
    await page.click('#new-game-btn');
    await dismissModeIfNeeded(page);
    await expect(
      page.locator('.calla-board, .calla-pit, #game-container').first()
    ).toBeVisible({ timeout: 8000 });
  });
});

test.describe('Wave 40 — Fab-a-Diffy chrome leftovers', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/fab-a-diffy');
    await dismissModeIfNeeded(page);
  });

  test('bar pool / answer board mount; help → new-game remount', async ({
    page,
  }) => {
    await expect(
      page
        .locator('.fab-bar-pool, .fab-answer-board, .fab-bar-grid')
        .first()
    ).toBeVisible({ timeout: 10000 });
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.click('#help-modal .modal-close');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
    await page.click('#new-game-btn');
    await dismissModeIfNeeded(page);
    await expect(
      page
        .locator(
          '.fab-bar-pool, .fab-answer-board, .fab-bar-grid, #game-container'
        )
        .first()
    ).toBeVisible({ timeout: 8000 });
  });
});

test.describe('Wave 40 — Juggle chrome leftovers', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/juggle');
    await dismissModeIfNeeded(page);
  });

  test('roll CTA mounts; help → new-game remounts roll chrome', async ({
    page,
  }) => {
    await expect(
      page.locator('.juggle-roll-btn, .juggle-board').first()
    ).toBeVisible({ timeout: 10000 });
    const roll = page.locator('.juggle-roll-btn');
    if (await roll.isVisible().catch(() => false)) {
      await roll.click();
    }
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.click('#help-modal .modal-close');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
    await page.click('#new-game-btn');
    await dismissModeIfNeeded(page);
    await expect(
      page
        .locator('.juggle-roll-btn, .juggle-board, .juggle-dice-area')
        .first()
    ).toBeVisible({ timeout: 8000 });
  });
});
