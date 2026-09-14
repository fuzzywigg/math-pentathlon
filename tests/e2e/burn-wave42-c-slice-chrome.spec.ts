/**
 * Wave 42 — C-slice chrome remount leftovers (kwatro / par / pent / prime / queens).
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

async function helpNewGameCycle(page: Page, boardSel: string) {
  await expect(page.locator(boardSel).first()).toBeVisible({ timeout: 10000 });
  await page.click('#help-btn');
  await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
  await page.click('#help-modal .modal-close');
  await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
  await page.click('#new-game-btn');
  await dismissModeIfNeeded(page);
  await expect(page.locator(boardSel).first()).toBeVisible({ timeout: 10000 });
}

test.describe('Wave 42 — C-slice chrome leftovers', () => {
  test('kwatro-sinko help + new-game remount', async ({ page }) => {
    await page.goto('/#/game/kwatro-sinko');
    await dismissModeIfNeeded(page);
    await helpNewGameCycle(
      page,
      '.kwa-board, .kwatro-board, .game-board, #game-container'
    );
  });

  test('par-55 Escape closes help', async ({ page }) => {
    await page.goto('/#/game/par-55');
    await dismissModeIfNeeded(page);
    await expect(
      page.locator('.par55-board, .game-board, #game-container').first()
    ).toBeVisible({ timeout: 10000 });
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.keyboard.press('Escape');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
  });

  test('pent-em-in help + new-game remount', async ({ page }) => {
    await page.goto('/#/game/pent-em-in');
    await dismissModeIfNeeded(page);
    await helpNewGameCycle(page, '.pent-board, .game-board, #game-container');
  });

  test('prime-gold help cycle keeps roll chrome', async ({ page }) => {
    await page.goto('/#/game/prime-gold');
    await dismissModeIfNeeded(page);
    await expect(page.locator('.pg-board, .pg-roll-btn').first()).toBeVisible({
      timeout: 10000,
    });
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.click('#help-modal .modal-close');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
    await expect(page.locator('.pg-roll-btn')).toBeVisible();
  });

  test('queens-guards help + new-game remount', async ({ page }) => {
    await page.goto('/#/game/queens-guards');
    await dismissModeIfNeeded(page);
    await helpNewGameCycle(
      page,
      '.qg-board-container, .qg-board, .game-board, #game-container'
    );
  });
});
