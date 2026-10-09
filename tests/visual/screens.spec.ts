/**
 * Opt-in 2D visual regression — landing page + each game's start/board screen.
 *
 * Run:  npm run test:visual
 * Update baselines: npm run test:visual:update
 *
 * Not part of required CI (see docs/visual-regression.md).
 */
import { test, expect } from '@playwright/test';
import {
  AVAILABLE_GAMES,
  gotoGameBoard,
  gotoLanding,
} from './helpers';

test.describe('visual regression — 2D screens', () => {
  test('landing page', async ({ page }) => {
    await gotoLanding(page);
    await expect(page).toHaveScreenshot('landing.png', {
      fullPage: true,
    });
  });

  for (const game of AVAILABLE_GAMES) {
    test(`${game.id} start/board (2D)`, async ({ page }) => {
      await gotoGameBoard(page, game.id);
      await expect(page).toHaveScreenshot(`${game.id}-board.png`, {
        fullPage: false,
      });
    });
  }
});
