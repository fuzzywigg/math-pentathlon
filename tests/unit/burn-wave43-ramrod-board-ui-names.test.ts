/**
 * Wave 43 — Ramrod board-ui player names leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { getPlayerName } from '../../src/games/ramrod/board-ui';

describe('Wave 43 ramrod — board-ui names', () => {
  it('distinct seat labels', () => {
    expect(getPlayerName('player1')).toBeTruthy();
    expect(getPlayerName('player2')).toBeTruthy();
    expect(getPlayerName('player1')).not.toBe(getPlayerName('player2'));
  });
});
