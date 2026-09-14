/**
 * Wave 40 — leftover engines chrome (calla / fab-a-diffy / juggle).
 * Existing game chrome remount only. No product inventing.
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

async function helpThenNewGame(page: Page) {
  const help = page.locator('#help-btn');
  if (await help.isVisible().catch(() => false)) {
    await help.click();
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.click('#help-modal .modal-close');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
  }
  const newGame = page.locator('#new-game-btn');
  if (await newGame.isVisible().catch(() => false)) {
    await newGame.click();
    await dismissModeIfNeeded(page);
  }
}

test.describe('Wave 40 — leftover engines chrome', () => {
  test('calla help → new-game keeps board chrome', async ({ page }) => {
    await page.goto('/#/game/calla');
    await dismissModeIfNeeded(page);
    await expect(page.locator('#board, .calla-board, .game-board').first()).toBeVisible({
      timeout: 8000,
    });
    await helpThenNewGame(page);
    await expect(page.locator('#board, .calla-board, .game-board').first()).toBeVisible({
      timeout: 8000,
    });
  });

  test('fab-a-diffy help → new-game remounts chrome', async ({ page }) => {
    await page.goto('/#/game/fab-a-diffy');
    await dismissModeIfNeeded(page);
    await expect(page.locator('#board, .fab-board, .game-board').first()).toBeVisible({
      timeout: 8000,
    });
    await helpThenNewGame(page);
    await expect(page.locator('#board, .fab-board, .game-board').first()).toBeVisible({
      timeout: 8000,
    });
  });

  test('juggle help → new-game remounts chrome', async ({ page }) => {
    await page.goto('/#/game/juggle');
    await dismissModeIfNeeded(page);
    await expect(page.locator('#board, .juggle-board, .game-board').first()).toBeVisible({
      timeout: 8000,
    });
    await helpThenNewGame(page);
    await expect(page.locator('#board, .juggle-board, .game-board').first()).toBeVisible({
      timeout: 8000,
    });
  });
});
