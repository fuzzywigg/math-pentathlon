/**
 * Overnight TOKENMAXX HEAVY leftovers after #272 — frac/pinball final-name + instruction chrome.
 * Distinct from wave57 Red-turn flow. Tests-only.
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

test.describe('Wave 58 — frac/pinball residual chrome', () => {
  test('frac-fact score value + answer box mins leftover', async ({ page }) => {
    await page.goto('/#/game/frac-fact');
    await dismissModeIfNeeded(page);
    await expect(page.locator('.frac-score-value').first()).toBeVisible({
      timeout: 10000,
    });
    await expect(page.locator('.frac-answer-box')).toBeVisible();
    await expect(page.locator('.frac-choice-btn')).toHaveCount(4);
  });

  test('fraction-pinball instruction + main chrome leftover', async ({
    page,
  }) => {
    await page.goto('/#/game/fraction-pinball');
    await dismissModeIfNeeded(page);
    await expect(page.locator('.pinball-main')).toBeVisible({
      timeout: 10000,
    });
    await expect(page.locator('.pinball-instruction')).toBeVisible();
    await expect(page.locator('.pinball-choice-btn')).toHaveCount(4);
    await expect(page.locator('.pinball-round-label')).toHaveText('Round');
  });
});
