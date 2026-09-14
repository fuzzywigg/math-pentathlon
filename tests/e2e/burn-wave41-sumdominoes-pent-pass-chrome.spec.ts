/**
 * Wave 41 — Sum Dominoes pass path + Pent-Em-In Escape/new-game leftovers.
 * Existing selectors from burn-wave38/39. No RNG score assertions. Tests-only.
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

test.describe('Wave 41 — Sum Dominoes pass path deepen', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/sum-dominoes');
    await dismissModeIfNeeded(page);
  });

  async function resolveOneRoll(page: Page) {
    await page.locator('.sd-roll-btn').click();
    await expect(page.locator('.sd-dice-display')).toBeVisible();

    const playable = page.locator('.sd-hand-domino-playable');
    const passBtn = page.locator('.sd-pass-btn');

    if ((await playable.count()) > 0) {
      if (await passBtn.isVisible().catch(() => false)) {
        await passBtn.click();
      } else {
        await playable.first().click();
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

  test('pass-friendly resolve keeps hands; Escape help; new-game remounts', async ({
    page,
  }) => {
    await resolveOneRoll(page);
    await resolveOneRoll(page);

    await expect(
      page.locator('.sd-hand-player1 .sd-hand-domino').first()
    ).toBeVisible();
    await expect(
      page.locator('.sd-hand-player2 .sd-hand-domino').first()
    ).toBeVisible();

    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.keyboard.press('Escape');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
    await expect(page.locator('.sd-board')).toBeVisible();
    await expect(page.locator('.sd-roll-btn')).toBeVisible();

    await page.click('#new-game-btn');
    await dismissModeIfNeeded(page);
    await expect(page.locator('.sd-roll-btn')).toBeVisible({ timeout: 8000 });
    await expect(page.locator('.sd-hand-player1 .sd-hand-domino')).toHaveCount(
      7,
      { timeout: 5000 }
    );
  });
});

test.describe('Wave 41 — Pent-Em-In Escape help + new-game', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/pent-em-in');
    await dismissModeIfNeeded(page);
  });

  test('board mounts; Escape closes help; new-game keeps shell', async ({
    page,
  }) => {
    await expect(
      page.locator('.pent-board, .pei-board, .game-board, canvas, svg').first()
    ).toBeVisible({ timeout: 10000 });

    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.keyboard.press('Escape');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
    await expect(
      page.locator('#game-container, .game-view, main').first()
    ).toBeVisible();

    await page.click('#new-game-btn');
    await dismissModeIfNeeded(page);
    await expect(
      page.locator('.pent-board, .pei-board, .game-board, canvas, svg, #game-container').first()
    ).toBeVisible({ timeout: 8000 });
  });
});
