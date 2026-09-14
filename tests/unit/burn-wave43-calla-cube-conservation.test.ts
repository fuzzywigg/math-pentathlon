/**
 * Wave 43 — Calla cube conservation leftover after wave41. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, TOTAL_CUBES } from '../../src/games/calla/types';
import { makeMove, getValidPits } from '../../src/games/calla/rules';

function total(s: ReturnType<typeof createInitialState>) {
  return (
    s.player1Pits.reduce((a, b) => a + b, 0) +
    s.player2Pits.reduce((a, b) => a + b, 0) +
    s.player1Calla +
    s.player2Calla
  );
}

describe('Wave 43 calla — cube conservation', () => {
  it('opening and chained legal moves preserve TOTAL_CUBES', () => {
    let s = createInitialState();
    expect(total(s)).toBe(TOTAL_CUBES);
    for (let i = 0; i < 8; i++) {
      const pits = getValidPits(s);
      if (pits.length === 0 || s.phase === 'gameOver') break;
      s = makeMove(s, pits[0]);
      expect(total(s)).toBe(TOTAL_CUBES);
    }
  });
});
