/**
 * Wave 38 — expression/dice game e2e leftovers after #171 / wave 35.
 * Existing Contig / Sum Dominoes / Juggle chrome only. Tests-only.
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

test.describe('Wave 38 — Contig dice/expression leftovers', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/contig-60');
    await dismissModeIfNeeded(page);
  });

  test('three-ply roll→resolve keeps roll CTA and score chrome', async ({
    page,
  }) => {
    for (let i = 0; i < 3; i++) {
      await page.locator('.contig-roll-btn').click();
      await expect(page.locator('.contig-dice-display')).toBeVisible();
      await expect(page.locator('.contig-expressions')).toBeVisible();
      const valid = page.locator('.contig-cell-valid');
      const pass = page.locator('.contig-pass-btn');
      if ((await valid.count()) > 0) {
        await valid.first().click();
      } else {
        await expect(pass).toBeVisible();
        await pass.click();
      }
      await expect(page.locator('.contig-roll-btn')).toBeVisible();
    }
    await expect(page.locator('.contig-score-p1')).toBeVisible();
    await expect(page.locator('.contig-score-p2')).toBeVisible();
  });

  test('new-game mid-roll remounts board with roll CTA', async ({ page }) => {
    await page.locator('.contig-roll-btn').click();
    await expect(page.locator('.contig-dice-display')).toBeVisible();
    await page.click('#new-game-btn');
    await dismissModeIfNeeded(page);
    await expect(page.locator('.contig-board')).toBeVisible();
    await expect(page.locator('.contig-roll-btn')).toBeVisible();
  });
});

test.describe('Wave 38 — Sum Dominoes dice leftovers', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/sum-dominoes');
    await dismissModeIfNeeded(page);
  });

  test('two roll cycles restore dice CTA and hands', async ({ page }) => {
    for (let i = 0; i < 2; i++) {
      await page.locator('.sd-roll-btn').click();
      await expect(page.locator('.sd-dice-display')).toBeVisible();
      const pass = page.locator('.sd-pass-btn');
      const hand = page.locator('.sd-hand-player1 .sd-hand-domino');
      if (await pass.isVisible().catch(() => false)) {
        await pass.click();
      } else if ((await hand.count()) > 0) {
        await hand.first().click();
        const cell = page
          .locator('.sd-board .sd-valid, .sd-cell-valid, .sd-board button')
          .first();
        if (await cell.isVisible().catch(() => false)) {
          await cell.click();
        }
      }
      await expect(page.locator('.sd-roll-btn')).toBeVisible({ timeout: 5000 });
    }
    await expect(page.locator('.sd-hand-player1 .sd-hand-domino').first()).toBeVisible();
  });
});

test.describe('Wave 38 — Juggle dice leftovers', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/juggle');
    await dismissModeIfNeeded(page);
  });

  test('help mid-roll keeps dice chrome mounted', async ({ page }) => {
    await page.locator('.juggle-roll-btn').click();
    await expect(
      page.locator('.juggle-dice-display, .juggle-dice-area, .juggle-die').first()
    ).toBeVisible();
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.click('#help-modal .modal-close');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
    await expect(
      page.locator('.juggle-dice-display, .juggle-dice-area, .juggle-die, .juggle-board').first()
    ).toBeVisible();
  });
});
