/**
 * Fullgame HvH e2e — stars-bars
 * Task: burn-1007-mp-e2e-fullgame
 * Tag: @fullgame (CI report-only; excluded from required chromium via grep-invert)
 */
import { test } from '../fixtures';
import { FULLGAME_TAG } from './_shared';
import { runFullgameMatch } from './_runner';

test.describe(`stars-bars fullgame ${FULLGAME_TAG}`, () => {
  test(`plays one complete human-vs-human match to game-over ${FULLGAME_TAG}`, async ({
    page,
  }) => {
    test.setTimeout(240000);
    await runFullgameMatch(page, 'stars-bars', {
      timeoutMs: 240000,
      maxTurns: 160,
    });
  });
});
