import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Math Pentathlon/);
});

test('displays game title', async ({ page }) => {
  await page.goto('/#/game/kings-quadraphages');
  await expect(page.locator('h1')).toContainText('Kings & Quadraphages');
});
