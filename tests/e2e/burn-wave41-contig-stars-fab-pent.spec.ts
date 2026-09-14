/**
 * Wave 41 HEAVY — e2e chrome for contig-60, stars-bars, fab-a-diffy, pent-em-in.
 * Existing selectors only. No product inventing.
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

test.describe('Wave 41 — Contig 60 chrome', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/contig-60');
    await dismissModeIfNeeded(page);
  });

  test('title, board, and scores visible', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Contig 60');
    await expect(page.locator('.contig-board')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('.contig-cell')).toHaveCount(60);
    await expect(page.locator('.contig-score-p1')).toBeVisible();
    await expect(page.locator('.contig-score-p2')).toBeVisible();
  });

  test('roll CTA then dice/expressions chrome', async ({ page }) => {
    await expect(page.locator('.contig-roll-btn')).toBeVisible({ timeout: 8000 });
    await page.locator('.contig-roll-btn').click();
    await expect(page.locator('.contig-dice-display')).toBeVisible({
      timeout: 8000,
    });
    await expect(page.locator('.contig-expressions')).toBeVisible();
  });
});

test.describe('Wave 41 — Stars & Bars chrome', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/stars-bars');
    await dismissModeIfNeeded(page);
  });

  test('title, board, and hand cards visible', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Stars & Bars');
    await expect(page.locator('.stars-board')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('.stars-card').first()).toBeVisible();
  });

  test('select hand card marks selected', async ({ page }) => {
    const card = page.locator('.stars-card:not(.disabled)').first();
    await expect(card).toBeVisible({ timeout: 8000 });
    await card.click({ force: true });
    await expect(page.locator('.stars-card.selected')).toBeVisible();
    await expect(page.locator('.stars-board')).toBeVisible();
  });
});

test.describe('Wave 41 — Fab-a-Diffy chrome', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/fab-a-diffy');
    await dismissModeIfNeeded(page);
  });

  test('title and pool/answer board visible', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Fab-a-Diffy');
    await expect(
      page.locator('.fab-bar-pool, .fab-answer-board').first()
    ).toBeVisible({ timeout: 10000 });
    await expect(page.locator('.fab-status')).toBeVisible();
  });

  test('selecting a bar marks selection chrome', async ({ page }) => {
    const bar = page.locator('.fab-bar-wrapper:not(.fab-bar-disabled)').first();
    await expect(bar).toBeVisible({ timeout: 8000 });
    await bar.click({ force: true });
    await expect(page.locator('.fab-bar-selected')).toBeVisible();
  });
});

test.describe("Wave 41 — Pent'Em In chrome", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/pent-em-in');
    await dismissModeIfNeeded(page);
  });

  test('title and board visible', async ({ page }) => {
    await expect(page.locator('h1')).toContainText("Pent'Em In");
    await expect(page.locator('.pent-board')).toBeVisible({ timeout: 10000 });
  });

  test('piece option select shows place instructions', async ({ page }) => {
    const piece = page.locator('.pent-piece-option').first();
    await expect(piece).toBeVisible({ timeout: 8000 });
    await piece.click({ force: true });
    await expect(
      page.locator('[role="status"], .pent-instructions').first()
    ).toContainText(/Place/i);
    await expect(page.locator('.pent-board')).toBeVisible();
  });
});
