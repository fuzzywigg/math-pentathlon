/**
 * Overnight HEAVY leftover after #241 — remainder board-ui chrome (help Escape).
 * Distinct from #241 graph/poly/align/owl and open contig/pinball drafts.
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

test.describe('Wave 54 — remainder-islands chrome leftover', () => {
  test('help Escape keeps remainder board / dice mounted', async ({ page }) => {
    await page.goto('/#/game/remainder-islands');
    await dismissModeIfNeeded(page);
    await expect(page.locator('.remainder-board, .island').first()).toBeVisible({
      timeout: 10000,
    });
    await expect(page.locator('.remainder-dice, .remainder-btn-roll').first()).toBeVisible();
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.keyboard.press('Escape');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
    await expect(page.locator('.remainder-board, .island').first()).toBeVisible();
  });
});
