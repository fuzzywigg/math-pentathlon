/**
 * Wave 58 Contig/SD residual — contig-60 × sum-dominoes chrome deepen.
 * Existing selectors only. Tests-only.
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

test.describe('Wave 58 leftover — Contig residual chrome', () => {
  test('scores + roll + help Escape remount', async ({ page }) => {
    await page.goto('/#/game/contig-60');
    await dismissModeIfNeeded(page);
    await expect(page.locator('.contig-score-p1')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('.contig-roll-btn')).toBeVisible();
    await expect(page.locator('.contig-status, [aria-live]').first()).toBeVisible();
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.keyboard.press('Escape');
    await expect(page.locator('.contig-board')).toBeVisible();
    await expect(page.locator('.contig-roll-btn')).toBeVisible();
  });
});

test.describe('Wave 58 leftover — Sum Dominoes residual chrome', () => {
  test('hand labels + roll + help Escape remount', async ({ page }) => {
    await page.goto('/#/game/sum-dominoes');
    await dismissModeIfNeeded(page);
    await expect(page.locator('.sd-hand-label.player1')).toBeVisible({
      timeout: 10000,
    });
    await expect(page.locator('.sd-roll-btn')).toBeVisible();
    await expect(page.locator('.sd-board')).toBeVisible();
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.keyboard.press('Escape');
    await expect(page.locator('.sd-dice-area')).toBeVisible();
    await expect(page.locator('.sd-hand-label.player2')).toBeVisible();
  });
});

test.describe('Wave 59 leftover — Contig roll click chrome', () => {
  test('roll enables dice display then status stays live', async ({ page }) => {
    await page.goto('/#/game/contig-60');
    await dismissModeIfNeeded(page);
    await expect(page.locator('.contig-roll-btn')).toBeVisible({ timeout: 10000 });
    await page.locator('.contig-roll-btn').click();
    await expect(page.locator('.contig-dice-display, .contig-no-moves, .contig-expr-list').first()).toBeVisible();
    await expect(page.locator('.contig-status, [aria-live]').first()).toBeVisible();
  });
});

test.describe('Wave 59 leftover — Sum roll click chrome', () => {
  test('roll shows dice sum or pass chrome', async ({ page }) => {
    await page.goto('/#/game/sum-dominoes');
    await dismissModeIfNeeded(page);
    await expect(page.locator('.sd-roll-btn')).toBeVisible({ timeout: 10000 });
    await page.locator('.sd-roll-btn').click();
    await expect(
      page.locator('.sd-dice-display, .sd-pass-btn, .sd-hand-domino-playable').first()
    ).toBeVisible();
  });
});
