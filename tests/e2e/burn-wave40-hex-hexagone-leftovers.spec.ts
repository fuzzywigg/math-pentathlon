/**
 * Wave 40 — Hex / Hex-A-Gone leftovers after #176.
 * Existing games only. Not contig/sum-dominoes/juggle/pent. Tests-only.
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

test.describe('Wave 40 — Hex place/help leftovers', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/hex');
    await dismissModeIfNeeded(page);
  });

  test('board mounts; cell click + help keeps chrome', async ({ page }) => {
    await expect(page.locator('.hex-board')).toBeVisible({ timeout: 10000 });
    const cell = page.locator('.hex-cell-group[data-row][data-col]').first();
    await expect(cell).toBeVisible();
    await cell.click({ force: true });
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.click('#help-modal .modal-close');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
    await expect(page.locator('.hex-board')).toBeVisible();
  });

  test('new-game remounts board', async ({ page }) => {
    await expect(page.locator('.hex-board')).toBeVisible();
    await page.click('#new-game-btn');
    await dismissModeIfNeeded(page);
    await expect(page.locator('.hex-board')).toBeVisible();
  });
});

test.describe('Wave 40 — Hex-A-Gone bank/confirm leftovers', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/hex-a-gone');
    await dismissModeIfNeeded(page);
  });

  test('bank select + confirm keeps board; help close remounts', async ({
    page,
  }) => {
    await expect(page.locator('.hex-a-gone-board')).toBeVisible({
      timeout: 10000,
    });
    const bankBtn = page.locator('.hex-a-gone-block-btn:not(.empty)').first();
    if (await bankBtn.isVisible().catch(() => false)) {
      await bankBtn.click();
      const confirm = page.locator('.hex-a-gone-confirm-btn');
      if (await confirm.isVisible().catch(() => false)) {
        await confirm.click();
        await expect(
          page.locator(
            '.hex-a-gone-placing-info, .hex-a-gone-board, .hex-a-gone-status'
          ).first()
        ).toBeVisible();
      }
    }
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.click('#help-modal .modal-close');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
    await expect(page.locator('.hex-a-gone-board')).toBeVisible();
  });

  test('new-game remounts bank chrome', async ({ page }) => {
    await expect(page.locator('.hex-a-gone-board')).toBeVisible();
    await page.click('#new-game-btn');
    await dismissModeIfNeeded(page);
    await expect(
      page.locator('.hex-a-gone-board, .hex-a-gone-bank').first()
    ).toBeVisible();
  });
});
