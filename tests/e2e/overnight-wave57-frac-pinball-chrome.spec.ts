/**
 * Overnight TOKENMAXX HEAVY leftovers after #260 — frac-fact × pinball chrome (choices + Red turn).
 * Distinct from wave56 status live/scores. Tests-only.
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

test.describe('Wave 57 — frac/pinball leftover chrome', () => {
  test('frac-fact four choices + continue to Red turn leftover', async ({
    page,
  }) => {
    await page.goto('/#/game/frac-fact');
    await dismissModeIfNeeded(page);
    await expect(page.locator('.frac-choice-btn')).toHaveCount(4, {
      timeout: 10000,
    });
    await page.locator('.frac-choice-btn').first().click();
    await expect(page.locator('.frac-continue-btn')).toBeVisible({
      timeout: 8000,
    });
    await page.locator('.frac-continue-btn').click();
    await expect(page.locator('.frac-status.player2')).toBeVisible({
      timeout: 8000,
    });
    await expect(page.locator('.frac-status.player2')).toContainText(
      /Red's turn/
    );
  });

  test('fraction-pinball four choices + continue to Red turn leftover', async ({
    page,
  }) => {
    await page.goto('/#/game/fraction-pinball');
    await dismissModeIfNeeded(page);
    await expect(page.locator('.pinball-choice-btn')).toHaveCount(4, {
      timeout: 10000,
    });
    await page.locator('.pinball-choice-btn').first().click();
    await expect(page.locator('.pinball-continue-btn')).toBeVisible({
      timeout: 8000,
    });
    await page.locator('.pinball-continue-btn').click();
    await expect(page.locator('.pinball-status.player2')).toBeVisible({
      timeout: 8000,
    });
    await expect(page.locator('.pinball-status.player2')).toContainText(
      /Red's turn/
    );
  });
});
