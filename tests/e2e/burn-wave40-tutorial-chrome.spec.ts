/**
 * Wave 40 — tutorial / shell chrome e2e leftovers after #175.
 * Existing game chrome only. No product inventing.
 */
import { test, expect, Page } from '@playwright/test';

async function dismissModeIfNeeded(page: Page) {
  const modal = page.locator('#new-game-modal');
  if (await modal.isVisible().catch(() => false)) {
    const start = page.locator('#start-game-btn');
    if (await start.isVisible().catch(() => false)) {
      await start.click();
    }
  }
}

test.describe('Wave 40 — tutorial chrome leftovers', () => {
  test('Hex tutorial opens then Escape exits; help still works', async ({
    page,
  }) => {
    await page.goto('/#/game/hex');
    await dismissModeIfNeeded(page);

    await page.locator('#tutorial-btn').click();
    await expect(
      page.locator('.tutorial-overlay, .tutorial-tooltip').first()
    ).toBeVisible({ timeout: 8000 });

    await page.keyboard.press('Escape');
    await expect(page.locator('.tutorial-overlay')).toHaveCount(0, {
      timeout: 5000,
    });

    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.click('#help-modal .modal-close');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
    await expect(page.locator('.hex-board, svg').first()).toBeVisible();
  });

  test('Kings tutorial mounts overlay then board chrome remains', async ({
    page,
  }) => {
    await page.goto('/#/game/kings-quadraphages');
    await dismissModeIfNeeded(page);

    const tut = page.locator('#tutorial-btn');
    if ((await tut.count()) === 0) {
      test.skip();
      return;
    }
    await tut.click();
    await expect(
      page.locator('.tutorial-tooltip, .tutorial-overlay').first()
    ).toBeVisible({ timeout: 8000 });
    await expect(
      page.locator('.kq-board, .kings-board, .game-board, .cell').first()
    ).toBeVisible();
  });
});

test.describe('Wave 40 — shell inspect chrome leftovers', () => {
  test('Contig help/new-game/back buttons stay mounted after help cycle', async ({
    page,
  }) => {
    await page.goto('/#/game/contig-60');
    await dismissModeIfNeeded(page);

    await expect(page.locator('#help-btn')).toBeVisible();
    await expect(page.locator('#new-game-btn')).toBeVisible();
    await expect(page.locator('#back-btn')).toBeVisible();

    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.keyboard.press('Escape');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);

    await expect(page.locator('.contig-board, .contig-roll-btn').first()).toBeVisible();
  });
});
