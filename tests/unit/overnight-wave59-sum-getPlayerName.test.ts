/**
 * Wave 59 leftover after #281 — Sum getPlayerName Blue/Red.
 * Distinct from Roll Dice / = 7 leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getPlayerName } from '../../src/games/sum-dominoes/board-ui';

describe('Wave 59 sum — getPlayerName', () => {
  it('maps player1/player2 to Blue/Red', () => {
    expect(getPlayerName('player1')).toBe('Blue');
    expect(getPlayerName('player2')).toBe('Red');
  });
});
