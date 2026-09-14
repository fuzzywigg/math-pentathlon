/**
 * Wave 48 leftover after #220/#221/#222 — calla/juggle/ramrod chrome.
 * Distinct from open #224 graph/hex. Existing selectors only.
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
  { id: 'calla', label: 'Calla' },
  { id: 'juggle', label: 'Juggle' },
  { id: 'ramrod', label: 'Ramrod' },
] as const) {
  test.describe(`Wave 48 — ${game.label} chrome leftovers`, () => {
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
