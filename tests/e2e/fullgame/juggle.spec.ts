/**
 * @fullgame burn-1007 — complete human-vs-human match for juggle.
 * Report-only in CI (required e2e grep-inverts @fullgame).
 */
import { test } from '../fixtures';
import { runFullgameMatch } from './_harness';

test.describe('@fullgame juggle', () => {
  test.skip(
    ({ browserName }) => browserName !== 'chromium',
    'Full-game HvH suite targets Chromium'
  );

  test('@fullgame complete HvH match to game-over', async ({ page }) => {
    // Softlock reshuffles under seeded deals can take a while in CI; 20m headroom.
    test.setTimeout(1_200_000);
    await runFullgameMatch(page, 'juggle');
  });
});
