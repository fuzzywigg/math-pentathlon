/**
 * Fullgame HvH e2e — kwatro-sinko
 * Task: burn-1007-mp-e2e-fullgame
 * Tag: @fullgame (CI report-only; excluded from required chromium via grep-invert)
 */
import { test } from '../fixtures';
import { FULLGAME_TAG } from './_shared';
import { runFullgameMatch } from './_runner';

test.describe(`kwatro-sinko fullgame ${FULLGAME_TAG}`, () => {
  test(`plays one complete human-vs-human match to game-over ${FULLGAME_TAG}`, async ({
    page,
  }) => {
    test.setTimeout(180000);
    await runFullgameMatch(page, 'kwatro-sinko', {
      timeoutMs: 180000,
      maxTurns: 160,
    });
  });
});
