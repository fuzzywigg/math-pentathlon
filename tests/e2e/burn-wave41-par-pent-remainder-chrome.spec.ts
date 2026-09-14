/**
 * Wave 41 — Par 55 / Pent\'Em In / Remainder chrome remount leftovers.
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

test.describe('Wave 41 — Par 55 chrome leftovers', () => {
  test('help + new-game remount keeps board chrome', async ({ page }) => {
    await page.goto('/#/game/par-55');
    await dismissModeIfNeeded(page);
    await expect(page.locator('.par55-board, .game-board, #game-container').first()).toBeVisible({
      timeout: 8000,
    });
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.click('#help-modal .modal-close');
    await page.click('#new-game-btn');
    await dismissModeIfNeeded(page);
    await expect(page.locator('.par55-board, .game-board, #game-container').first()).toBeVisible({
      timeout: 8000,
    });
  });
});

test.describe('Wave 41 — Pent\'Em In chrome leftovers', () => {
  test('help closes and board stays mounted', async ({ page }) => {
    await page.goto('/#/game/pent-em-in');
    await dismissModeIfNeeded(page);
    await expect(page.locator('.pent-board, .game-board, #game-container').first()).toBeVisible({
      timeout: 8000,
    });
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.click('#help-modal .modal-close');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
  });
});

test.describe('Wave 41 — Remainder reinforce chrome', () => {
  test('roll CTA visible after help cycle', async ({ page }) => {
    await page.goto('/#/game/remainder-islands');
    await dismissModeIfNeeded(page);
    const roll = page.locator('.remainder-btn-roll');
    await expect(roll).toBeVisible();
    await page.click('#help-btn');
    await page.click('#help-modal .modal-close');
    await expect(roll).toBeVisible();
  });
});
