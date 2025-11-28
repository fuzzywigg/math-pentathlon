import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Math Pentathlon/);
});

test('displays welcome message', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('Math Pentathlon');
});
