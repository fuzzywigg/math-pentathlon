/**
 * Wave 53 — chrome remount for fab-a-diffy leftovers after #235.
 * Distinct from #235–#238 hex/par/kwatro/stars/remainder/sum/fiar/kings/queens/star/calla/juggle/ramrod.
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

test.describe('Wave 53 — fab-a-diffy chrome leftover', () => {
  test('help Escape keeps bar pool / answer board mounted', async ({ page }) => {
    await page.goto('/#/game/fab-a-diffy');
    await dismissModeIfNeeded(page);
    await expect(page.locator('.fab-bar-pool, .fab-bar-wrapper').first()).toBeVisible({
      timeout: 10000,
    });
    await expect(page.locator('.fab-answer-board, .fab-answer-wrapper').first()).toBeVisible();
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.keyboard.press('Escape');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
    await expect(page.locator('.fab-bar-pool, .fab-bar-wrapper').first()).toBeVisible();
    await expect(page.locator('.fab-answer-board, .fab-answer-wrapper').first()).toBeVisible();
  });
});
