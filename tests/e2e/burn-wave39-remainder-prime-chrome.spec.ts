/**
 * Wave 39 — Remainder Islands + Prime Gold chrome remount leftovers after #174.
 * Existing game chrome only. No product inventing.
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

test.describe('Wave 39 — Remainder Islands chrome leftovers', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/remainder-islands');
    await dismissModeIfNeeded(page);
  });

  test('roll CTA → help → new-game remounts roll CTA', async ({ page }) => {
    const roll = page.locator('.remainder-btn-roll');
    await expect(roll).toBeVisible();
    await roll.click();
    await expect(page.locator('.remainder-board')).toBeVisible();
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.click('#help-modal .modal-close');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
    await page.click('#new-game-btn');
    await dismissModeIfNeeded(page);
    await expect(page.locator('.remainder-btn-roll, .remainder-board').first()).toBeVisible({
      timeout: 8000,
    });
  });

  test('two rolls keep board chrome mounted', async ({ page }) => {
    for (let i = 0; i < 2; i++) {
      const roll = page.locator('.remainder-btn-roll');
      if (await roll.isVisible().catch(() => false)) {
        await roll.click();
      } else {
        // Selecting phase — remount to restore roll CTA
        await page.click('#new-game-btn');
        await dismissModeIfNeeded(page);
        await page.locator('.remainder-btn-roll').click();
      }
      await expect(page.locator('.remainder-board')).toBeVisible();
    }
  });
});

test.describe('Wave 39 — Prime Gold chrome leftovers', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/prime-gold');
    await dismissModeIfNeeded(page);
  });

  test('roll CTA and board mount; help keeps shell', async ({ page }) => {
    await expect(
      page.locator('.pg-roll-btn, .pg-board').first()
    ).toBeVisible({ timeout: 10000 });
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.click('#help-modal .modal-close');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
    await expect(
      page.locator('.pg-roll-btn, .pg-board, #game-container').first()
    ).toBeVisible();
  });

  test('new-game remount restores prime chrome', async ({ page }) => {
    const roll = page.locator('.pg-roll-btn');
    if (await roll.isVisible().catch(() => false)) {
      await roll.click();
    }
    await page.click('#new-game-btn');
    await dismissModeIfNeeded(page);
    await expect(
      page.locator('.pg-roll-btn, .pg-board').first()
    ).toBeVisible({ timeout: 8000 });
  });
});
