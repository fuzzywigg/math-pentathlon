/**
 * Wave 42 leftovers B — Fab + Frac + FIAR Escape-help chrome leftovers.
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

test.describe('Wave 42 — Fab Escape help chrome', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/fab-a-diffy');
    await dismissModeIfNeeded(page);
  });

  test('bar pool chrome + Escape help + remount', async ({ page }) => {
    await expect(
      page.locator('.fab-bar-pool, .fab-answer-board, .fab-board').first()
    ).toBeVisible({ timeout: 10000 });

    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.keyboard.press('Escape');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);

    await page.click('#new-game-btn');
    await dismissModeIfNeeded(page);
    await expect(
      page.locator('.fab-bar-pool, .fab-answer-board').first()
    ).toBeVisible({ timeout: 8000 });
  });
});

test.describe('Wave 42 — Frac-Fact Escape help chrome', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/frac-fact');
    await dismissModeIfNeeded(page);
  });

  test('problem/choices + Escape help keeps scores chrome', async ({ page }) => {
    await expect(
      page.locator('.frac-problem, .frac-choice-btn').first()
    ).toBeVisible({ timeout: 10000 });
    await expect(page.locator('.frac-scores').first()).toBeVisible();

    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.keyboard.press('Escape');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);

    await expect(page.locator('.frac-scores').first()).toBeVisible();
  });
});

test.describe('Wave 42 — FIAR Escape help chrome', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/fiar');
    await dismissModeIfNeeded(page);
  });

  test('board chrome + Escape help + remount', async ({ page }) => {
    await expect(
      page.locator('.fiar-board, #board, svg, .game-board').first()
    ).toBeVisible({ timeout: 10000 });

    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.keyboard.press('Escape');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);

    await page.click('#new-game-btn');
    await dismissModeIfNeeded(page);
    await expect(
      page.locator('.fiar-board, #board, svg, .game-board').first()
    ).toBeVisible({ timeout: 8000 });
  });
});
