/**
 * Overnight TOKENMAXX HEAVY — fraction + graph demo e2e interaction leftovers.
 * Wave39 e2e skipped these routes. Chrome-only (no RNG). Tests-only.
 */
import { test, expect } from '@playwright/test';

test.describe('Overnight demos45 — fraction demo interaction', () => {
  test('segment click + compare chrome on /demo/fractions', async ({ page }) => {
    await page.goto('/#/demo/fractions');
    await expect(page.locator('h1')).toContainText(/Fraction/i);
    await expect(page.locator('#interactive-bar')).toBeVisible({
      timeout: 8000,
    });

    const segment = page.locator('#interactive-bar .fraction-segment').nth(2);
    if (await segment.isVisible().catch(() => false)) {
      await segment.click();
      await expect(page.locator('#interactive-value')).toBeVisible();
    }

    await page.locator('#compare-a').fill('1/3');
    await page.locator('#compare-b').fill('2/3');
    await page.locator('#compare-btn').click();
    await expect(page.locator('#comparison-result')).toBeVisible();
    await expect(page.locator('#back-btn')).toBeVisible();
  });
});

test.describe('Overnight demos45 — graph demo interaction', () => {
  test('template switch + path + claim chrome on /demo/graph', async ({
    page,
  }) => {
    await page.goto('/#/demo/graph');
    await expect(page.locator('h1')).toContainText(/Graph/i);
    await expect(page.locator('#template-graph')).toBeVisible({
      timeout: 8000,
    });

    const star = page.locator('.template-btn[data-template="star"]');
    if (await star.isVisible().catch(() => false)) {
      await star.click();
      await expect(page.locator('#template-info')).toContainText(/Nodes/i);
    }

    const pathNode = page.locator('#pathfinding-graph .graph-node').first();
    if (await pathNode.isVisible().catch(() => false)) {
      await pathNode.click({ force: true });
      await expect(page.locator('#path-status')).toBeVisible();
    }

    const gameNode = page.locator('#game-graph .graph-node').first();
    if (await gameNode.isVisible().catch(() => false)) {
      await gameNode.click({ force: true });
      await expect(page.locator('#game-analysis')).toBeVisible();
    }

    await expect(page.locator('#back-btn')).toBeVisible();
  });
});
