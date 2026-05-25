import { test, expect } from '@playwright/test';

// Helper function to click a cell by row and col (1-based)
async function clickCell(page: import('@playwright/test').Page, row: number, col: number) {
  await page.click(`.cell[data-row="${row}"][data-col="${col}"]`);
}

test.describe('AI Opponent', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/kings-quadraphages');
  });

  test('new game modal shows AI options', async ({ page }) => {
    // Open new game modal
    await page.click('#new-game-btn');
    await expect(page.locator('#new-game-modal')).not.toHaveClass(/hidden/);

    // Check mode options exist
    await expect(page.locator('.mode-option[data-mode="human-vs-ai"]')).toBeVisible();
    await expect(page.locator('.mode-option[data-mode="human-vs-human"]')).toBeVisible();

    // AI mode should be selected by default
    await expect(page.locator('.mode-option[data-mode="human-vs-ai"]')).toHaveClass(/selected/);

    // Difficulty section should be visible
    await expect(page.locator('#difficulty-section')).toBeVisible();

    // All difficulty buttons should exist
    await expect(page.locator('.difficulty-btn.easy')).toBeVisible();
    await expect(page.locator('.difficulty-btn.medium')).toBeVisible();
    await expect(page.locator('.difficulty-btn.hard')).toBeVisible();

    // Medium should be selected by default
    await expect(page.locator('.difficulty-btn.medium')).toHaveClass(/selected/);
  });

  test('switching to human vs human hides difficulty options', async ({ page }) => {
    await page.click('#new-game-btn');

    // Difficulty section visible for AI mode
    await expect(page.locator('#difficulty-section')).toBeVisible();

    // Switch to human vs human
    await page.click('.mode-option[data-mode="human-vs-human"]');

    // Difficulty section should be hidden
    await expect(page.locator('#difficulty-section')).toHaveCSS('display', 'none');
  });

  test('can select different AI difficulties', async ({ page }) => {
    await page.click('#new-game-btn');

    // Click Easy
    await page.click('.difficulty-btn.easy');
    await expect(page.locator('.difficulty-btn.easy')).toHaveClass(/selected/);
    await expect(page.locator('.difficulty-btn.medium')).not.toHaveClass(/selected/);

    // Click Hard
    await page.click('.difficulty-btn.hard');
    await expect(page.locator('.difficulty-btn.hard')).toHaveClass(/selected/);
    await expect(page.locator('.difficulty-btn.easy')).not.toHaveClass(/selected/);
  });

  test('AI makes a move after human moves', async ({ page }) => {
    // Start a new game vs AI
    await page.click('#new-game-btn');
    await expect(page.locator('.mode-option[data-mode="human-vs-ai"]')).toHaveClass(/selected/);
    await page.click('#start-game-btn');

    // Should be Player 1's turn (human)
    await expect(page.locator('.status-turn')).toContainText('Player 1');

    // Make human's move - select king and move it
    await clickCell(page, 1, 5); // Select P1 king
    await clickCell(page, 2, 5); // Move king down

    // Place quadraphage
    await clickCell(page, 5, 5);

    // Wait for AI to think and move (AI thinking delay is ~500ms + 300ms for move)
    // After AI move, it should be Player 1's turn again
    await expect(page.locator('.status-turn')).toContainText('Player 1', { timeout: 5000 });

    // AI should have placed a quadraphage (supply reduced)
    await expect(page.locator('.supply-p2')).toContainText('29');
  });

  test('AI mode shows correct status', async ({ page }) => {
    // Start AI game
    await page.click('#new-game-btn');
    await page.click('#start-game-btn');

    // Status should show AI mode indicator
    const statusText = await page.locator('#status').textContent();
    expect(statusText).toContain('AI');
  });

  test('2 player mode works without AI', async ({ page }) => {
    // Start 2 player game
    await page.click('#new-game-btn');
    await page.click('.mode-option[data-mode="human-vs-human"]');
    await page.click('#start-game-btn');

    // Player 1 turn
    await expect(page.locator('.status-turn')).toContainText('Player 1');

    // Make P1 move
    await clickCell(page, 1, 5);
    await clickCell(page, 2, 5);
    await clickCell(page, 5, 5);

    // Should be Player 2's turn (not AI)
    await expect(page.locator('.status-turn')).toContainText('Player 2');

    // Wait a bit - no AI should move
    await page.waitForTimeout(1000);

    // Should still be Player 2's turn
    await expect(page.locator('.status-turn')).toContainText('Player 2');
  });

  test('AI game can be restarted with different settings', async ({ page }) => {
    // Start Easy AI game
    await page.click('#new-game-btn');
    await page.click('.difficulty-btn.easy');
    await page.click('#start-game-btn');

    // Make a move
    await clickCell(page, 1, 5);
    await clickCell(page, 2, 5);
    await clickCell(page, 5, 5);

    // Wait for AI
    await expect(page.locator('.status-turn')).toContainText('Player 1', { timeout: 5000 });

    // Start new game with Hard difficulty
    await page.click('#new-game-btn');
    await page.click('.difficulty-btn.hard');
    await page.click('#start-game-btn');

    // Game should be reset
    await expect(page.locator('.supply-p1')).toContainText('30');
    await expect(page.locator('.supply-p2')).toContainText('30');
  });
});
