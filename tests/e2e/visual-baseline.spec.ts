/**
 * Visual regression baselines: start screen + every game opening position
 * at desktop and phone projects (see playwright.config.ts).
 *
 * Deterministic seeds + animations disabled — see helpers/visual-stability.ts.
 * Update baselines: npm run test:e2e:visual -- --update-snapshots
 * Docs: docs/wiki/development.md#visual-regression-baselines
 */
import { test, expect } from '@playwright/test';
import { GAMES } from '../../src/core/game-registry';
import {
  VISUAL_SHOT_OPTS,
  installVisualStability,
  openGameOpening,
  openStartScreen,
} from './helpers/visual-stability';
import {
  GAME_MOUNT as MOUNT,
} from './helpers/page';

const AVAILABLE_GAMES = GAMES.filter((g) => g.available);

test.describe('Visual baselines', () => {
  test.beforeEach(async ({ page }) => {
    await installVisualStability(page);
  });

  test('start screen', async ({ page }) => {
    await openStartScreen(page);
    await expect(page).toHaveScreenshot('start-screen.png', VISUAL_SHOT_OPTS);
  });

  for (const game of AVAILABLE_GAMES) {
    test(`${game.id} opening`, async ({ page }) => {
      test.setTimeout(60_000);
      await openGameOpening(page, game.id);
      const mountSel = MOUNT[game.id] ?? '#board, #game-container, main';
      await expect(page.locator(mountSel).first()).toBeVisible({
        timeout: 10_000,
      });
      await expect(page).toHaveScreenshot(`${game.id}-opening.png`, VISUAL_SHOT_OPTS);
    });
  }
});
