/**
 * Wave 39 — attribute + alignment demo e2e leftovers after #174.
 * Prefer demos over Contig/Juggle/Sum Dominoes (already burned). Tests-only.
 */
import { test, expect } from '@playwright/test';

test.describe('Wave 39 — alignment demo leftovers', () => {
  test('mounts three sections and survives help-less chrome click', async ({
    page,
  }) => {
    await page.goto('/#/demo/alignment');
    await expect(page.locator('h1')).toContainText(/Alignment/i);
    await expect(page.locator('.alignment-demo-section')).toHaveCount(3);
    await expect(page.locator('#four-board .demo-cell').first()).toBeVisible();

    await page.locator('#four-board .demo-cell').nth(2).click();
    await expect(
      page
        .locator('#four-board .demo-cell.cell-x, #four-board .demo-cell.cell-o')
        .first()
    ).toBeVisible();
    await expect(page.locator('#four-info')).toBeVisible();

    await page.locator('#four-reset').click();
    await expect(
      page.locator(
        '#four-board .demo-cell.cell-x, #four-board .demo-cell.cell-o'
      )
    ).toHaveCount(0);

    await expect(page.locator('.back-link, #back-btn').first()).toBeVisible();
  });

  test('hex section mounts cells after four-in-a-row interaction', async ({
    page,
  }) => {
    await page.goto('/#/demo/alignment');
    await page.locator('#four-board .demo-cell').first().click();
    await expect(page.locator('#hex-board, .hex-board').first()).toBeVisible();
    const hex = page.locator('.demo-hex-cell, #hex-board .demo-cell').first();
    if (await hex.isVisible().catch(() => false)) {
      await hex.click({ force: true });
    }
    await expect(page.locator('#hex-status, #hex-info').first()).toBeVisible();
  });
});

test.describe('Wave 39 — attributes demo leftovers', () => {
  test('mounts piece grid and SET section chrome', async ({ page }) => {
    await page.goto('/#/demo/attributes');
    await expect(page.locator('h1')).toContainText(/Attribute/i);
    await expect(page.locator('#piece-grid, .piece-grid').first()).toBeVisible({
      timeout: 8000,
    });
    await expect(page.locator('#set-grid')).toBeVisible();

    const piece = page.locator('.piece-wrapper, #piece-grid svg').first();
    if (await piece.isVisible().catch(() => false)) {
      await piece.click();
      await expect(page.locator('#selected-info')).toBeVisible();
    }

    const setBtn = page.locator('.set-btn[data-set="math"]');
    if (await setBtn.isVisible().catch(() => false)) {
      await setBtn.click();
    }

    await expect(page.locator('#back-btn')).toBeVisible();
  });
});
