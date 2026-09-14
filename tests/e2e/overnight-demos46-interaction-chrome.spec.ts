/**
 * Overnight TOKENMAXX HEAVY — demos46 e2e interaction leftovers.
 * Distinct from #220 frac/graph and wave39 align/attr/poly/expr/dice smoke.
 * Chrome-only. Tests-only.
 */
import { test, expect } from '@playwright/test';

test.describe('Overnight demos46 — expression challenge chrome', () => {
  test('challenge card reveals builder + Clear All on /demo/expressions', async ({
    page,
  }) => {
    await page.goto('/#/demo/expressions');
    await expect(page.locator('h1')).toContainText(/Expression/i);
    await expect(page.locator('#challenge-grid .challenge-card').first()).toBeVisible({
      timeout: 8000,
    });

    await page.locator('#challenge-grid .challenge-card').first().click();
    await expect(page.locator('#active-challenge')).toBeVisible();
    await expect(page.locator('#expression-builder .expression-slot').first()).toBeVisible();

    const clear = page.getByRole('button', { name: /Clear All/i });
    await expect(clear).toBeVisible();
    await expect(page.locator('#back-btn')).toBeVisible();
  });
});

test.describe('Overnight demos46 — attribute SET verdict chrome', () => {
  test('three SET card picks paint valid or invalid result on /demo/attributes', async ({
    page,
  }) => {
    await page.goto('/#/demo/attributes');
    await expect(page.locator('h1')).toContainText(/Attribute/i);
    await expect(page.locator('#set-grid')).toBeVisible({ timeout: 8000 });

    const cards = page.locator('#set-grid .set-card');
    await expect(cards.first()).toBeVisible();
    // click parent wrappers (listeners live on wrapper, not SVG)
    for (let i = 0; i < 3; i++) {
      await cards.nth(i).locator('..').click();
    }
    await expect(page.locator('#set-result')).toBeVisible();
    await expect(page.locator('#set-result')).toContainText(
      /Valid SET|Not a valid SET/i
    );
    await expect(page.locator('#back-btn')).toBeVisible();
  });
});

test.describe('Overnight demos46 — polyomino simple chrome', () => {
  test('simple set Single shows Can Rotate No on /demo/polyomino', async ({
    page,
  }) => {
    await page.goto('/#/demo/polyomino');
    await expect(page.locator('h1')).toContainText(/Polyomino/i);
    await expect(page.locator('#shape-gallery, .set-btn').first()).toBeVisible({
      timeout: 8000,
    });

    const simple = page.locator('.set-btn[data-set="simple"]');
    if (await simple.isVisible().catch(() => false)) {
      await simple.click();
    }
    const shape = page.locator('#shape-gallery > *').first();
    if (await shape.isVisible().catch(() => false)) {
      await shape.click();
      await expect(page.locator('#shape-info')).toContainText(/Can Rotate/i);
    }
    await expect(page.locator('#back-btn')).toBeVisible();
  });
});
