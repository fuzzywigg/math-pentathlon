/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — E2E contig/sum/remainder chrome. Tests-only.
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

test.describe('Wave 56 — contig/sum/remainder leftover chrome', () => {
  test('sum-dominoes help Escape keeps board/dice leftover chrome', async ({ page }) => {
    await page.goto('/#/game/sum-dominoes');
    await dismissModeIfNeeded(page);
    await expect(page.locator('.sd-board, .sd-dice-area').first()).toBeVisible({
      timeout: 10000,
    });
    await expect(page.locator('.sd-roll-btn').first()).toBeVisible();
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.keyboard.press('Escape');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
    await expect(page.locator('.sd-board, .sd-dice-area').first()).toBeVisible();
  });
});
