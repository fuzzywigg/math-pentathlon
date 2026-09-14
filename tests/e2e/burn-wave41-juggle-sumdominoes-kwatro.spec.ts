/**
 * Wave 41 HEAVY — e2e chrome for juggle, sum-dominoes, kwatro-sinko.
 * Assert only existing selectors/titles. No product inventing.
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

test.describe('Wave 41 — Juggle chrome', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/juggle');
    await dismissModeIfNeeded(page);
  });

  test('title, board, and roll CTA visible', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Juggle');
    await expect(page.locator('.juggle-board').first()).toBeVisible({
      timeout: 10000,
    });
    await expect(page.locator('.juggle-roll-btn')).toBeVisible();
  });

  test('roll CTA reveals dice chrome', async ({ page }) => {
    await page.locator('.juggle-roll-btn').click();
    await expect(
      page.locator('.juggle-dice-display, .juggle-dice-area, .juggle-die').first()
    ).toBeVisible({ timeout: 8000 });
  });
});

test.describe('Wave 41 — Sum Dominoes chrome', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/sum-dominoes');
    await dismissModeIfNeeded(page);
  });

  test('title, board, hands, and roll CTA', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Sum Dominoes');
    await expect(page.locator('.sd-board')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('.sd-hand-player1 .sd-hand-domino')).toHaveCount(7);
    await expect(page.locator('.sd-roll-btn')).toBeVisible();
  });

  test('roll advances to dice display', async ({ page }) => {
    await page.locator('.sd-roll-btn').click();
    await expect(page.locator('.sd-dice-display')).toBeVisible({ timeout: 8000 });
  });
});

test.describe('Wave 41 — Kwatro-Sinko chrome', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/kwatro-sinko');
    await dismissModeIfNeeded(page);
  });

  test('title and board visible with selectable chips', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Kwatro-Sinko');
    await expect(page.locator('.kwa-board')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('.kwa-selectable-chip').first()).toBeVisible();
  });

  test('help modal opens and closes without unmounting board', async ({
    page,
  }) => {
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.click('#help-modal .modal-close');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
    await expect(page.locator('.kwa-board')).toBeVisible();
  });
});
