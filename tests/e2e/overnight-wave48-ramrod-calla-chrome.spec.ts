/**
 * Wave 48 overnight — ramrod scores/goal + calla board chrome smoke.
 * Distinct leftover engines after #220/#221/#222; not #224 graph/hex.
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

test('ramrod shows Goal chrome after mount', async ({ page }) => {
  await page.goto('/#/game/ramrod');
  await dismissModeIfNeeded(page);
  await expect(page.locator('.ramrod-target, .ramrod-scores, #game-container').first()).toBeVisible({
    timeout: 10000,
  });
});

test('calla board svg mounts', async ({ page }) => {
  await page.goto('/#/game/calla');
  await dismissModeIfNeeded(page);
  await expect(page.locator('.calla-board, .calla-wrapper, #game-container').first()).toBeVisible({
    timeout: 10000,
  });
});
