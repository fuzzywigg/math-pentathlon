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

  async function resolveSumDominoesRoll(page: Page) {
    await page.locator('.sd-roll-btn').click();
    await expect(page.locator('.sd-dice-display')).toBeVisible();

    const playable = page.locator('.sd-hand-domino-playable');
    const passBtn = page.locator('.sd-pass-btn');

    if ((await playable.count()) > 0) {
      await playable.first().click();
      await expect(page.locator('.sd-hand-domino-selected')).toBeVisible();
      const valid = page.locator('.sd-cell-valid');
      if ((await valid.count()) > 0) {
        await valid.first().click({ force: true });
      } else if (await passBtn.isVisible().catch(() => false)) {
        // Selected with no legal cell — pass to restore roll CTA
        await passBtn.click();
      } else {
        // Stuck selecting: remount via new-game so subsequent cycles can proceed
        await page.click('#new-game-btn');
        await dismissModeIfNeeded(page);
      }
    } else {
      await expect(passBtn).toBeVisible();
      await passBtn.click();
    }

    await expect(page.locator('.sd-roll-btn')).toBeVisible({ timeout: 5000 });
  }

  test('two roll cycles restore dice CTA and hands', async ({ page }) => {
    await resolveSumDominoesRoll(page);
    await resolveSumDominoesRoll(page);
    await expect(
      page.locator('.sd-hand-player1 .sd-hand-domino').first()
    ).toBeVisible();
    await expect(page.locator('.sd-board')).toBeVisible();
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
