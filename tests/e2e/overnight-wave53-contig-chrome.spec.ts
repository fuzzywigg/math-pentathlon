/**
 * Wave 53 — Escape remount chrome for contig-60 leftovers after #236.
 * Distinct from remainder/sum/fiar, kings/queens/fiar/star, calla/juggle/ramrod, fab.
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

test.describe('Wave 53 — contig-60 leftover chrome', () => {
  test('help Escape keeps dice/board leftover chrome mounted', async ({ page }) => {
    await page.goto('/#/game/contig-60');
    await dismissModeIfNeeded(page);
    await expect(page.locator('.contig-board, .contig-dice-area').first()).toBeVisible({
      timeout: 10000,
    });
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.keyboard.press('Escape');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
    await expect(page.locator('.contig-board, .contig-dice-area').first()).toBeVisible();
  });
});
