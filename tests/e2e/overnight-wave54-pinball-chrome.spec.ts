/**
 * Wave 54 — chrome remount for fraction-pinball leftovers after #240.
 * Distinct from MERGEABLE #241 core graph/poly/align/owl.
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

test.describe('Wave 54 — fraction-pinball chrome leftover', () => {
  test('help Escape keeps challenge / scores / board mounted', async ({
    page,
  }) => {
    await page.goto('/#/game/fraction-pinball');
    await dismissModeIfNeeded(page);
    await expect(
      page.locator('.pinball-challenge, .pinball-scores, .pinball-board').first()
    ).toBeVisible({ timeout: 10000 });
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.keyboard.press('Escape');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
    await expect(
      page.locator('.pinball-challenge, .pinball-scores, .pinball-board').first()
    ).toBeVisible();
  });
});
