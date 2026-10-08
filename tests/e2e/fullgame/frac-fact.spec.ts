/**
 * Fullgame HvH e2e — frac-fact
 * Task: burn-1007-mp-e2e-fullgame
 * Tag: @fullgame (CI report-only; excluded from required chromium via grep-invert)
 */
import { test } from '../fixtures';
import { FULLGAME_TAG } from './_shared';
import { runFullgameMatch } from './_runner';

test.describe(`frac-fact fullgame ${FULLGAME_TAG}`, () => {
  test(`plays one complete human-vs-human match to game-over ${FULLGAME_TAG}`, async ({
    page,
  }) => {
    test.setTimeout(180000);
    await runFullgameMatch(page, 'frac-fact', {
      timeoutMs: 180000,
      maxTurns: 160,
    });
  });
});
