/**
 * Chunk-load failure recovery: when a lazy game module fails to fetch,
 * the shell shows a friendly retry UI; after the network recovers, Try again
 * remounts the game.
 *
 * Uses Calla (not Hex/Kings) so idle-warm / Division-I prefetch cannot cache
 * the module before the abort route is armed.
 *
 * Runs against the shared Playwright webServer (vite dev). Does not touch
 * scoring or game rules.
 */
import { expect, test } from '@playwright/test';

test.describe('lazy chunk load recovery', () => {
  test('shows retry UI when Calla chunk fails, then recovers on Try again', async ({
    page,
  }) => {
    test.setTimeout(60_000);

    let failCallaChunk = true;
    await page.route('**/games/calla/game-controller*', async (route) => {
      if (failCallaChunk) {
        await route.abort('failed');
        return;
      }
      await route.continue();
    });

    // Direct deep-link — arm the abort before any game-controller request.
    await page.goto('/#/game/calla');

    const error = page.getByTestId('game-load-error');
    await expect(error).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('game-load-error-hint')).toBeVisible();
    await expect(error).toContainText(/Could not load Calla/i);
    await expect(page.locator('[data-action="retry"]')).toBeVisible();
    await expect(page.locator('[data-action="home"]')).toBeVisible();

    failCallaChunk = false;
    // Retry reloads the page so the browser module map can re-fetch the chunk.
    await page.locator('[data-action="retry"]').click();

    await expect(page.locator('h1')).toContainText('Calla', {
      timeout: 20_000,
    });
    await expect(page.getByTestId('game-load-error')).toBeHidden({
      timeout: 5_000,
    });
    await expect(
      page.locator('.calla-wrapper, .calla-pit, #board').first()
    ).toBeVisible({
      timeout: 15_000,
    });
  });
});
