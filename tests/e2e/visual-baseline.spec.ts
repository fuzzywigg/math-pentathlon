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

const AVAILABLE_GAMES = GAMES.filter((g) => g.available);

/** Primary board / play surface that proves the opening mounted. */
const MOUNT: Record<string, string> = {
  'kings-quadraphages': '#board .board .cell, .cell-king',
  hex: '.hex-board',
  'star-track': '.star-track-board',
  'hex-a-gone': '.hex-a-gone-board',
  calla: '.calla-wrapper, .calla-pit',
  'sum-dominoes': '.sd-board',
  'par-55': '.par55-board',
  ramrod: '.ramrod-board',
  'kwatro-sinko': '.kwa-board',
  fiar: '.fiar-board-container',
  juggle: '.juggle-board',
  'contig-60': '.contig-board',
  'stars-bars': '.stars-board',
  'fab-a-diffy': '.fab-bar-pool, .fab-answer-board',
  'queens-guards': '.qg-board-container',
  'prime-gold': '.pg-board, .prime-board',
  'remainder-islands': '.remainder-board',
  'pent-em-in': '.pent-board',
  'frac-fact': '.frac-problem, .frac-choice-btn',
  'fraction-pinball':
    '.pinball-board, .pinball-challenge, .pinball-game-container, .pinball-choice-btn',
};

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
