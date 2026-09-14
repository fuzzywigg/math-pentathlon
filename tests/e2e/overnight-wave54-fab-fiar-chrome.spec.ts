/**
 * Wave 54 — chrome remount leftovers for fab-a-diffy scores + FIAR chips-info
 * after #240/#241. Distinct from wave52 data-node-id and wave53 bar/answer pools.
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

test.describe('Wave 54 — fab scores leftover', () => {
  test('help Escape keeps scores / status mounted', async ({ page }) => {
    await page.goto('/#/game/fab-a-diffy');
    await dismissModeIfNeeded(page);
    await expect(page.locator('.fab-scores, .fab-score-p1').first()).toBeVisible({
      timeout: 10000,
    });
    await expect(page.locator('.fab-status, .fab-game-area').first()).toBeVisible();
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.keyboard.press('Escape');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
    await expect(page.locator('.fab-scores, .fab-score-p1').first()).toBeVisible();
  });
});

test.describe('Wave 54 — fiar chips leftover', () => {
  test('help Escape keeps chips-info / status mounted', async ({ page }) => {
    await page.goto('/#/game/fiar');
    await dismissModeIfNeeded(page);
    await expect(
      page.locator('.fiar-chips-info, .fiar-status, .fiar-chip-count').first()
    ).toBeVisible({ timeout: 10000 });
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.keyboard.press('Escape');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
    await expect(
      page.locator('.fiar-chips-info, .fiar-status, .fiar-chip-count').first()
    ).toBeVisible();
  });
});
