/**
 * @fullgame burn-1007 — complete human-vs-human match for hex-a-gone.
 * Report-only in CI (required e2e grep-inverts @fullgame).
 */
import { test } from '../fixtures';
import { runFullgameMatch } from './_harness';

test.describe('@fullgame hex-a-gone', () => {
  test.skip(
    ({ browserName }) => browserName !== 'chromium',
    'Full-game HvH suite targets Chromium'
  );

  test('@fullgame complete HvH match to game-over', async ({ page }) => {
    test.setTimeout(300_000);
    await runFullgameMatch(page, 'hex-a-gone');
  });
});
