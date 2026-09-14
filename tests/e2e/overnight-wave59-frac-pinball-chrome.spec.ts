/**
 * Wave 59 leftover after #272 — frac/pinball Blue turn chrome remount.
 * Distinct from wave57 choice→continue→Red turn. Tests-only.
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

test.describe('Wave 59 — frac leftover chrome', () => {
  test("exact 🔵 Blue's turn remounts after help Escape", async ({ page }) => {
    await page.goto('/#/game/frac-fact');
    await dismissModeIfNeeded(page);
    await expect(page.locator('.frac-status')).toHaveText("🔵 Blue's turn", {
      timeout: 10000,
    });
    await expect(page.locator('.frac-player-name.player1')).toHaveText(
      '🔵 Blue'
    );
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.keyboard.press('Escape');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
    await expect(page.locator('.frac-status')).toHaveText("🔵 Blue's turn");
    await expect(page.locator('.frac-player-name.player1')).toHaveText(
      '🔵 Blue'
    );
  });
});

test.describe('Wave 59 — pinball leftover chrome', () => {
  test("exact 🔵 Blue's turn + Round label remount after help Escape", async ({
    page,
  }) => {
    await page.goto('/#/game/fraction-pinball');
    await dismissModeIfNeeded(page);
    await expect(page.locator('.pinball-status')).toHaveText("🔵 Blue's turn", {
      timeout: 10000,
    });
    await expect(page.locator('.pinball-round-label')).toBeVisible();
    await page.click('#help-btn');
    await page.keyboard.press('Escape');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
    await expect(page.locator('.pinball-status')).toHaveText("🔵 Blue's turn");
    await expect(page.locator('.pinball-round-label')).toBeVisible();
  });
});
