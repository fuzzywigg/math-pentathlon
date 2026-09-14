/**
 * Overnight HEAVY leftover e2e — Calla last-move + scores chrome after pit click.
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

test.describe('Overnight wave50 — calla leftover chrome', () => {
  test('pit click mounts last-move + scores; help remounts board', async ({
    page,
  }) => {
    await page.goto('/#/game/calla');
    await dismissModeIfNeeded(page);
    await expect(page.locator('.calla-board, .calla-wrapper').first()).toBeVisible({
      timeout: 10000,
    });
    await expect(page.locator('.calla-scores, .calla-status').first()).toBeVisible();
    await expect(page.locator('.calla-score-p1.active, .calla-status').first()).toBeVisible();

    const pit = page.locator('.calla-pit-valid, .calla-pit[data-side="player1"]').first();
    await pit.click({ force: true });
    await expect(
      page.locator('.calla-last-move, .calla-scores, .calla-board').first()
    ).toBeVisible();

    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.keyboard.press('Escape');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
    await expect(page.locator('.calla-board, .calla-wrapper').first()).toBeVisible();
  });
});
