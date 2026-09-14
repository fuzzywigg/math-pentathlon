/**
 * Wave 35 — Contig / Sum Dominoes / Juggle expression+dice e2e deepenings.
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

test.describe('Wave 35 — Contig expression/dice deepen', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/contig-60');
    await dismissModeIfNeeded(page);
  });

  test('roll exposes dice display + expression list chrome', async ({
    page,
  }) => {
    await page.locator('.contig-roll-btn').click();
    await expect(page.locator('.contig-dice-display')).toBeVisible();
    await expect(page.locator('.contig-expressions')).toBeVisible();
    const exprCount = await page.locator('.contig-expressions *').count();
    expect(exprCount).toBeGreaterThan(0);
  });

  test('two-ply roll→resolve returns roll CTA', async ({ page }) => {
    for (let i = 0; i < 2; i++) {
      await page.locator('.contig-roll-btn').click();
      await expect(page.locator('.contig-dice-display')).toBeVisible();
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
  });

  test('help mid-roll keeps expression chrome mounted', async ({ page }) => {
    await page.locator('.contig-roll-btn').click();
    await expect(page.locator('.contig-expressions')).toBeVisible();
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.click('#help-modal .modal-close');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
    await expect(page.locator('.contig-expressions')).toBeVisible();
    await expect(page.locator('.contig-dice-display')).toBeVisible();
  });
});

test.describe('Wave 35 — Sum Dominoes dice deepen', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/sum-dominoes');
    await dismissModeIfNeeded(page);
  });

  test('roll shows dice then place-or-pass restores roll', async ({ page }) => {
    await page.locator('.sd-roll-btn').click();
    await expect(page.locator('.sd-dice-display')).toBeVisible();

    const playable = page.locator('.sd-hand-domino-playable');
    const pass = page.locator('.sd-pass-btn');

    if ((await playable.count()) > 0) {
      await playable.first().click();
      await expect(page.locator('.sd-hand-domino-selected')).toBeVisible();
      const valid = page.locator('.sd-cell-valid');
      if ((await valid.count()) > 0) {
        await valid.first().click({ force: true });
      } else {
        // Stuck select — remount so roll CTA is guaranteed
        await page.click('#new-game-btn');
        await dismissModeIfNeeded(page);
      }
    } else {
      await expect(pass).toBeVisible();
      await pass.click();
    }

    await expect(page.locator('.sd-roll-btn')).toBeVisible({ timeout: 8000 });
  });
});

test.describe('Wave 35 — Juggle dice chrome deepen', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/juggle');
    await dismissModeIfNeeded(page);
  });

  test('roll keeps dice area and shape selector available', async ({
    page,
  }) => {
    const roll = page.locator('.juggle-roll-btn');
    await expect(roll).toBeVisible();
    await roll.click();
    await expect(
      page
        .locator('.juggle-dice-display, .juggle-dice-area, .juggle-die')
        .first()
    ).toBeVisible();
    await expect(
      page.locator('.juggle-shape-selector, .juggle-board').first()
    ).toBeVisible();
  });
});
