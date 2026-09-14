/**
 * Wave 41 — Contig + Juggle Escape-help / score chrome leftovers.
 * Existing selectors only (burn-wave38/39 patterns). Tests-only.
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

test.describe('Wave 41 — Contig Escape help + score chrome', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/contig-60');
    await dismissModeIfNeeded(page);
  });

  test('help Escape closes; score chrome stays; roll CTA remounts', async ({
    page,
  }) => {
    await expect(page.locator('.contig-roll-btn')).toBeVisible({
      timeout: 10000,
    });
    await expect(page.locator('.contig-score-p1')).toBeVisible();
    await expect(page.locator('.contig-score-p2')).toBeVisible();

    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.keyboard.press('Escape');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);

    await expect(page.locator('.contig-board')).toBeVisible();
    await expect(page.locator('.contig-score-p1')).toBeVisible();
    await expect(page.locator('.contig-roll-btn')).toBeVisible();

    await page.click('#new-game-btn');
    await dismissModeIfNeeded(page);
    await expect(page.locator('.contig-roll-btn')).toBeVisible({
      timeout: 8000,
    });
    await expect(page.locator('.contig-score-p2')).toBeVisible();
  });
});

test.describe('Wave 41 — Juggle Escape help leftovers', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/juggle');
    await dismissModeIfNeeded(page);
  });

  test('roll → Escape help → board chrome still mounted', async ({ page }) => {
    const roll = page.locator('.juggle-roll-btn');
    await expect(roll).toBeVisible({ timeout: 10000 });
    await roll.click();
    await expect(
      page.locator('.juggle-dice-display, .juggle-dice-area, .juggle-die').first()
    ).toBeVisible();

    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.keyboard.press('Escape');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);

    await expect(
      page.locator('.juggle-board, .juggle-shape-selector, .juggle-dice-display').first()
    ).toBeVisible();
  });
});
