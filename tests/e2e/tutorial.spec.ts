import { test, expect } from '@playwright/test';

test.describe('Tutorial System', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate directly to the game
    await page.goto('/#/game/kings-quadraphages');
  });

  test('tutorial button exists and starts tutorial', async ({ page }) => {
    // Tutorial button should be visible
    await expect(page.locator('#tutorial-btn')).toBeVisible();
    await expect(page.locator('#tutorial-btn')).toContainText('Tutorial');

    // Click tutorial button
    await page.click('#tutorial-btn');

    // Tutorial overlay should appear
    await expect(page.locator('.tutorial-overlay')).toBeVisible();
    await expect(page.locator('.tutorial-tooltip')).toBeVisible();

    // First step should be welcome message
    await expect(page.locator('.tutorial-tooltip-title')).toContainText('Welcome');
  });

  test('tutorial can navigate through steps with Next button', async ({ page }) => {
    // Start tutorial
    await page.click('#tutorial-btn');

    // Check step counter shows "Step 1 of X"
    await expect(page.locator('.tutorial-step-counter')).toContainText('Step 1 of');

    // Click Next
    await page.click('.tutorial-next-btn');

    // Should advance to step 2
    await expect(page.locator('.tutorial-step-counter')).toContainText('Step 2 of');

    // Title should change
    await expect(page.locator('.tutorial-tooltip-title')).toContainText('Game Objective');
  });

  test('tutorial can navigate back with Back button', async ({ page }) => {
    // Start tutorial
    await page.click('#tutorial-btn');

    // Back button should be hidden/disabled on first step
    const backBtn = page.locator('.tutorial-prev-btn');
    await expect(backBtn).not.toBeVisible();

    // Go to step 2
    await page.click('.tutorial-next-btn');
    await expect(page.locator('.tutorial-step-counter')).toContainText('Step 2 of');

    // Back button should now be visible
    await expect(backBtn).toBeVisible();

    // Click back
    await page.click('.tutorial-prev-btn');

    // Should be back at step 1
    await expect(page.locator('.tutorial-step-counter')).toContainText('Step 1 of');
  });

  test('tutorial can be exited with X button', async ({ page }) => {
    // Start tutorial
    await page.click('#tutorial-btn');
    await expect(page.locator('.tutorial-overlay')).toBeVisible();

    // Click exit button
    await page.click('.tutorial-exit-btn');

    // Tutorial should close
    await expect(page.locator('.tutorial-overlay')).not.toBeVisible();
    await expect(page.locator('.tutorial-tooltip')).not.toBeVisible();
  });

  test('tutorial can be exited with Escape key', async ({ page }) => {
    // Start tutorial
    await page.click('#tutorial-btn');
    await expect(page.locator('.tutorial-overlay')).toBeVisible();

    // Press Escape
    await page.keyboard.press('Escape');

    // Tutorial should close
    await expect(page.locator('.tutorial-overlay')).not.toBeVisible();
  });

  test('tutorial highlights game board on board step', async ({ page }) => {
    // Start tutorial
    await page.click('#tutorial-btn');

    // Navigate to the board intro step (step 3)
    await page.click('.tutorial-next-btn'); // Step 2 - Objective
    await page.click('.tutorial-next-btn'); // Step 3 - The Game Board

    // Check we're on the board intro step
    await expect(page.locator('.tutorial-tooltip-title')).toContainText('Game Board');

    // Highlight ring should be visible
    await expect(page.locator('.tutorial-highlight-ring')).toBeVisible();
  });

  test('tutorial step requiring action shows waiting state', async ({ page }) => {
    // Start tutorial
    await page.click('#tutorial-btn');

    // Navigate to the "select king" step (step 7)
    for (let i = 0; i < 6; i++) {
      await page.click('.tutorial-next-btn');
    }

    // Check we're on the select king step
    await expect(page.locator('.tutorial-tooltip-title')).toContainText('Select Your King');

    // Next button should show waiting state
    const nextBtn = page.locator('.tutorial-next-btn');
    await expect(nextBtn).toHaveClass(/tutorial-btn-waiting/);
    await expect(nextBtn).toContainText('Complete the action');
  });

  test('tutorial advances when required action is performed', async ({ page }) => {
    // Start tutorial
    await page.click('#tutorial-btn');

    // Navigate to the "select king" step (step 7)
    for (let i = 0; i < 6; i++) {
      await page.click('.tutorial-next-btn');
    }

    // Verify we're on the select king step
    await expect(page.locator('.tutorial-tooltip-title')).toContainText('Select Your King');

    // Click the king at row 1, col 5
    await page.click('.cell[data-row="1"][data-col="5"]');

    // Tutorial should advance to next step
    await expect(page.locator('.tutorial-tooltip-title')).toContainText('Valid Moves');
  });

  test('tutorial resets game when started', async ({ page }) => {
    // Make a move first
    await page.click('.cell[data-row="1"][data-col="5"]'); // Select king
    await page.click('.cell[data-row="2"][data-col="5"]'); // Move king
    await page.click('.cell[data-row="5"][data-col="5"]'); // Place quadraphage

    // Verify game state changed
    await expect(page.locator('.supply-p1')).toContainText('29');

    // Start tutorial
    await page.click('#tutorial-btn');

    // Wait for tutorial to appear and game to reset
    await expect(page.locator('.tutorial-overlay')).toBeVisible();

    // Close tutorial
    await page.click('.tutorial-exit-btn');

    // Game should still show the moves made before (tutorial exit doesn't reset)
    // Actually, looking at the code, the game resets when tutorial starts
    // Let's verify kings are back at starting positions
    const p1King = page.locator('.cell[data-row="1"][data-col="5"]');
    await expect(p1King).toHaveClass(/cell-king/);
  });

  test('tutorial completes and shows finish button on last step', async ({ page }) => {
    // Start tutorial
    await page.click('#tutorial-btn');

    // Get total steps from counter
    const counterText = await page.locator('.tutorial-step-counter').textContent();
    const totalSteps = parseInt(counterText?.match(/of (\d+)/)?.[1] || '0');

    // Navigate through all steps (clicking through non-action steps)
    // For action steps, perform the required action
    for (let step = 1; step < totalSteps; step++) {
      const title = await page.locator('.tutorial-tooltip-title').textContent();

      if (title?.includes('Select Your King')) {
        // Click king at row 1, col 5
        await page.click('.cell[data-row="1"][data-col="5"]');
      } else if (title?.includes('Move Your King')) {
        // Click destination at row 2, col 5
        await page.click('.cell[data-row="2"][data-col="5"]');
      } else {
        // Regular step - click Next
        const nextBtn = page.locator('.tutorial-next-btn');
        if (!(await nextBtn.isDisabled())) {
          await page.click('.tutorial-next-btn');
        }
      }

      // Small delay to let animation complete
      await page.waitForTimeout(100);
    }

    // On the last step, button should say "Finish"
    await expect(page.locator('.tutorial-next-btn')).toContainText('Finish');
  });
});
