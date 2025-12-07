import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test('has title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Math Pentathlon/);
  });

  test('displays game selector', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Math Pentathlon');
  });

  test('shows available games', async ({ page }) => {
    await page.goto('/');
    // Kings & Quadraphages should be available
    await expect(page.locator('.game-card-title').first()).toContainText('Kings & Quadraphages');
  });

  test('navigates to game when clicked', async ({ page }) => {
    await page.goto('/');
    // Click on Kings & Quadraphages card
    await page.locator('.game-card').first().click();
    // Should navigate to game
    await expect(page).toHaveURL(/#\/game\/kings-quadraphages/);
    await expect(page.locator('h1')).toContainText('Kings & Quadraphages');
  });

  test('back button returns to game list', async ({ page }) => {
    await page.goto('/#/game/kings-quadraphages');
    await page.click('#back-btn');
    await expect(page).toHaveURL(/\/#?\/?$/);
    await expect(page.locator('h1')).toContainText('Math Pentathlon');
  });
});
