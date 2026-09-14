/**
 * Wave 39 — Contig pass chrome + Sum Dominoes pass/new-game leftovers.
 * Existing games only after #172/#173. Tests-only.
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

test.describe('Wave 39 — Contig pass/help/score leftovers', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/contig-60');
    await dismissModeIfNeeded(page);
  });

  test('pass path keeps score chrome; help open/close keeps board', async ({
    page,
  }) => {
    for (let i = 0; i < 2; i++) {
      await page.locator('.contig-roll-btn').click();
      await expect(page.locator('.contig-dice-display')).toBeVisible();
      const valid = page.locator('.contig-cell-valid');
      const pass = page.locator('.contig-pass-btn');
      if ((await valid.count()) > 0) {
        // Prefer pass when available to deepen pass chrome; else resolve
        if (await pass.isVisible().catch(() => false)) {
          await pass.click();
        } else {
          await valid.first().click();
        }
      } else {
        await expect(pass).toBeVisible();
        await pass.click();
      }
      await expect(page.locator('.contig-roll-btn')).toBeVisible();
    }

    await expect(page.locator('.contig-score-p1')).toBeVisible();
    await expect(page.locator('.contig-score-p2')).toBeVisible();

    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.click('#help-modal .modal-close');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
    await expect(page.locator('.contig-board')).toBeVisible();
    await expect(page.locator('.contig-roll-btn')).toBeVisible();
  });
});

test.describe('Wave 39 — Sum Dominoes pass/new-game hands', () => {
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
      // Prefer pass when visible (leftover pass chrome); else play or remount
      if (await passBtn.isVisible().catch(() => false)) {
        await passBtn.click();
      } else {
        await playable.first().click();
        await expect(page.locator('.sd-hand-domino-selected')).toBeVisible();
        const valid = page.locator('.sd-cell-valid');
        if ((await valid.count()) > 0) {
          await valid.first().click({ force: true });
        } else if (await passBtn.isVisible().catch(() => false)) {
          await passBtn.click();
        } else {
          await page.click('#new-game-btn');
          await dismissModeIfNeeded(page);
        }
      }
    } else {
      await expect(passBtn).toBeVisible();
      await passBtn.click();
    }

    await expect(page.locator('.sd-roll-btn')).toBeVisible({ timeout: 5000 });
  }

  test('multi-pass keeps hands; new-game remounts roll CTA', async ({
    page,
  }) => {
    await resolveSumDominoesRoll(page);
    await resolveSumDominoesRoll(page);

    await expect(
      page.locator('.sd-hand-player1 .sd-hand-domino').first()
    ).toBeVisible();
    await expect(
      page.locator('.sd-hand-player2 .sd-hand-domino').first()
    ).toBeVisible();

    await page.click('#new-game-btn');
    await dismissModeIfNeeded(page);
    await expect(page.locator('.sd-board')).toBeVisible();
    await expect(page.locator('.sd-roll-btn')).toBeVisible();
    await expect(page.locator('.sd-hand-player1 .sd-hand-domino')).toHaveCount(
      7,
      { timeout: 5000 }
    );
  });
});
