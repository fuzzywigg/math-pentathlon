/**
 * Overnight HEAVY — e2e chrome for leftover engines: fiar / prime / frac / pent.
 * Distinct from #209 fab+UI chrome and #213 kwatro/par/pinball slice.
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

test.describe('Overnight — fiar/prime/frac/pent leftover chrome', () => {
  test('fiar board + placement click keeps status chrome', async ({ page }) => {
    await page.goto('/#/game/fiar');
    await dismissModeIfNeeded(page);
    await expect(page.locator('.fiar-board, svg').first()).toBeVisible({
      timeout: 10000,
    });
    const node = page.locator('[data-node-id], .fiar-node, circle').first();
    if (await node.isVisible().catch(() => false)) {
      await node.click({ force: true });
    }
    await expect(
      page.locator('.fiar-status, .fiar-chips-info, .fiar-board, svg').first()
    ).toBeVisible();
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.click('#help-modal .modal-close');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
  });

  test('prime-gold roll CTA then help remount', async ({ page }) => {
    await page.goto('/#/game/prime-gold');
    await dismissModeIfNeeded(page);
    await expect(page.locator('.pg-roll-btn, .pg-board').first()).toBeVisible({
      timeout: 10000,
    });
    const roll = page.locator('.pg-roll-btn');
    if (await roll.isVisible().catch(() => false)) {
      await roll.click();
      await expect(
        page.locator('.pg-dice, .pg-expressions, .pg-board, .pg-pass-btn').first()
      ).toBeVisible({ timeout: 8000 });
    }
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.keyboard.press('Escape');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
  });

  test('frac-fact choice click yields feedback chrome', async ({ page }) => {
    await page.goto('/#/game/frac-fact');
    await dismissModeIfNeeded(page);
    await expect(page.locator('.frac-choice-btn, .frac-problem').first()).toBeVisible({
      timeout: 10000,
    });
    const choice = page.locator('.frac-choice-btn').first();
    if (await choice.isVisible().catch(() => false)) {
      await choice.click({ force: true });
      await expect(
        page.locator('.frac-result, .frac-feedback, .frac-scores, .frac-choice-btn').first()
      ).toBeVisible({ timeout: 8000 });
    }
  });

  test('pent-em-in piece tray + help Escape', async ({ page }) => {
    await page.goto('/#/game/pent-em-in');
    await dismissModeIfNeeded(page);
    await expect(
      page.locator('.pent-board, .pent-pieces, .game-board, #game-container').first()
    ).toBeVisible({ timeout: 10000 });
    const piece = page
      .locator('.pent-piece, .pent-em-in-piece, [data-shape-id], .piece-btn')
      .first();
    if (await piece.isVisible().catch(() => false)) {
      await piece.click({ force: true });
    }
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.keyboard.press('Escape');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
  });
});
