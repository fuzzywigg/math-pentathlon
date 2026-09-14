/**
 * Wave 42 — Kings getOpponent seat flip.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { getOpponent } from '../../src/games/kings-quadraphages/rules';

describe('Wave 42 kings — getOpponent flip', () => {
  it('player1 ↔ player2', () => {
    expect(getOpponent('player1')).toBe('player2');
    expect(getOpponent('player2')).toBe('player1');
  });

  it('double flip restores seat', () => {
    expect(getOpponent(getOpponent('player1'))).toBe('player1');
    expect(getOpponent(getOpponent('player2'))).toBe('player2');
  });

  it('flip is involution across array of seats', () => {
    const seats = ['player1', 'player2'] as const;
    for (const s of seats) {
      expect(getOpponent(getOpponent(s))).toBe(s);
      expect(getOpponent(s)).not.toBe(s);
    }
  });
});
