/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — frac-fact + pinball status aria chrome.
 * Distinct from wave55 choice/continue remount. Tests-only.
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

test.describe('Wave 56 — frac-fact + pinball leftover chrome', () => {
  test('frac-fact status is polite live region leftover', async ({ page }) => {
    await page.goto('/#/game/frac-fact');
    await dismissModeIfNeeded(page);
    const status = page.locator('.frac-status');
    await expect(status).toBeVisible({ timeout: 10000 });
    await expect(status).toHaveAttribute('role', 'status');
    await expect(status).toHaveAttribute('aria-live', 'polite');
    await expect(status).toContainText("Blue's turn");
  });

  test('pinball status is polite live region leftover', async ({ page }) => {
    await page.goto('/#/game/fraction-pinball');
    await dismissModeIfNeeded(page);
    const status = page.locator('.pinball-status');
    await expect(status).toBeVisible({ timeout: 10000 });
    await expect(status).toHaveAttribute('role', 'status');
    await expect(status).toHaveAttribute('aria-live', 'polite');
    await expect(status).toContainText("Blue's turn");
    await expect(page.locator('.pinball-main')).toBeVisible();
  });
});
