/**
 * Wave 41 — Remainder Islands + Prime Gold Escape help / chrome leftovers.
 * Extends burn-wave39 with Escape + remount; existing selectors only.
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

test.describe('Wave 41 — Remainder Escape help leftovers', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/remainder-islands');
    await dismissModeIfNeeded(page);
  });

  test('roll CTA → Escape help → remount keeps roll/board chrome', async ({
    page,
  }) => {
    const roll = page.locator('.remainder-btn-roll');
    await expect(roll).toBeVisible({ timeout: 10000 });
    await roll.click();
    await expect(page.locator('.remainder-board')).toBeVisible();

    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.keyboard.press('Escape');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
    await expect(page.locator('.remainder-board')).toBeVisible();

    await page.click('#new-game-btn');
    await dismissModeIfNeeded(page);
    await expect(
      page.locator('.remainder-btn-roll, .remainder-board').first()
    ).toBeVisible({ timeout: 8000 });
  });
});

test.describe('Wave 41 — Prime Gold Escape + score chrome leftovers', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/prime-gold');
    await dismissModeIfNeeded(page);
  });

  test('Escape help keeps shell; new-game restores roll/board/scores', async ({
    page,
  }) => {
    await expect(
      page.locator('.pg-roll-btn, .pg-board').first()
    ).toBeVisible({ timeout: 10000 });

    const roll = page.locator('.pg-roll-btn');
    if (await roll.isVisible().catch(() => false)) {
      await roll.click();
    }

    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.keyboard.press('Escape');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);

    await expect(
      page.locator('.pg-roll-btn, .pg-board, .pg-scores, #game-container').first()
    ).toBeVisible();

    await page.click('#new-game-btn');
    await dismissModeIfNeeded(page);
    await expect(
      page.locator('.pg-roll-btn, .pg-board').first()
    ).toBeVisible({ timeout: 8000 });
  });
});
