/**
 * Wave 43 — Stars board-ui names leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { getPlayerName } from '../../src/games/stars-bars/board-ui';

describe('Wave 43 stars-bars — board-ui names', () => {
  it('distinct seat labels', () => {
    expect(getPlayerName('player1')).toBeTruthy();
    expect(getPlayerName('player2')).toBeTruthy();
    expect(getPlayerName('player1')).not.toBe(getPlayerName('player2'));
  });
});
