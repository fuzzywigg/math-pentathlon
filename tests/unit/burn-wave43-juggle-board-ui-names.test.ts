/**
 * Wave 43 — Juggle board-ui player name leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { getPlayerName } from '../../src/games/juggle/board-ui';

describe('Wave 43 juggle — board-ui names', () => {
  it('maps seats to display names', () => {
    expect(getPlayerName('player1')).toBeTruthy();
    expect(getPlayerName('player2')).toBeTruthy();
    expect(getPlayerName('player1')).not.toBe(getPlayerName('player2'));
  });
});
