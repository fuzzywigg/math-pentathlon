/**
 * Wave 47 leftover after #214/#215 — chrome remount for distinct leftover engines.
 * Existing selectors only. Not fab/UI or pinball/remainder/kings/queens.
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

for (const game of [
  { id: 'stars-bars', label: 'Stars & Bars' },
  { id: 'sum-dominoes', label: 'Sum Dominoes' },
  { id: 'star-track', label: 'Star Track' },
  { id: 'hex-a-gone', label: 'Hex-a-Gone' },
  { id: 'par-55', label: 'Par 55' },
  { id: 'kwatro-sinko', label: 'Kwatro-Sinko' },
] as const) {
  test.describe(`Wave 47 — ${game.label} chrome leftovers`, () => {
    test('help open/close keeps shell mounted', async ({ page }) => {
      await page.goto(`/#/game/${game.id}`);
      await dismissModeIfNeeded(page);
      await expect(
        page.locator('#game-container, .game-board, main').first()
      ).toBeVisible({ timeout: 10000 });
      await page.click('#help-btn');
      await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
      await page.click('#help-modal .modal-close');
      await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
      await expect(page.locator('#new-game-btn')).toBeVisible();
    });
  });
}
