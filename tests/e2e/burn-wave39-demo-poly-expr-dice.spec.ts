/**
 * Wave 39 — polyomino / expressions / dice demo e2e leftovers after #174.
 * Assert chrome, not RNG outcomes. Tests-only.
 */
import { test, expect } from '@playwright/test';

test.describe('Wave 39 — polyomino demo leftovers', () => {
  test('mounts gallery and switches shape sets', async ({ page }) => {
    await page.goto('/#/demo/polyomino');
    await expect(page.locator('h1')).toContainText(/Polyomino/i);
    await expect(page.locator('#shape-gallery')).toBeVisible({ timeout: 8000 });

    const firstShape = page.locator('#shape-gallery svg, #shape-gallery .shape-item, #shape-gallery button, #shape-gallery > *').first();
    if (await firstShape.isVisible().catch(() => false)) {
      await firstShape.click();
    }

    const pent = page.locator('.set-btn[data-set="pentominoes"]');
    if (await pent.isVisible().catch(() => false)) {
      await pent.click();
      await expect(page.locator('#shape-gallery')).toBeVisible();
    }

    await expect(page.locator('#board-container, #clear-board-btn').first()).toBeVisible();
    await expect(page.locator('#back-btn')).toBeVisible();
  });
});

test.describe('Wave 39 — expressions demo leftovers', () => {
  test('calculator and equation chrome evaluate without inventing UI', async ({
    page,
  }) => {
    await page.goto('/#/demo/expressions');
    await expect(page.locator('h1')).toContainText(/Expression/i);
    await expect(page.locator('#calc-input')).toBeVisible({ timeout: 8000 });

    await page.locator('#calc-input').fill('2 + 3 * 4');
    await page.locator('#calc-btn').click();
    await expect(page.locator('#calc-result')).toBeVisible();

    await page.locator('#equation-input').fill('2 + 2 = 4');
    await page.locator('#check-equation-btn').click();
    await expect(page.locator('#equation-result')).toBeVisible();

    await expect(page.locator('#challenge-grid')).toBeVisible();
    await expect(page.locator('#back-btn')).toBeVisible();
  });
});

test.describe('Wave 39 — dice demo leftovers', () => {
  test('quick roll CTA mounts result chrome', async ({ page }) => {
    await page.goto('/#/demo/dice');
    await expect(page.locator('h1, .dice-demo').first()).toBeVisible({
      timeout: 8000,
    });
    await expect(page.locator('.quick-roll-btn').first()).toBeVisible();

    await page.locator('.quick-roll-btn').first().click();
    await expect(page.locator('#quick-roll-result')).toBeVisible();
    // Prefer chrome over exact face values (RNG)
    await expect(
      page.locator('#quick-roll-result .die-wrapper, #quick-roll-result svg, #quick-roll-result .dice-roll-result').first()
    ).toBeVisible({ timeout: 8000 });

    await expect(page.locator('.back-link, #back-btn').first()).toBeVisible();
  });
});
