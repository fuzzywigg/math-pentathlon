/**
 * Wave 43 — Calla sweep-to-tie leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { makeMove, getPhaseMessage, isGameOver } from '../../src/games/calla/rules';

describe('Wave 43 calla — tie sweep', () => {
  it('emptying a side with equal stores yields tie', () => {
    const state = {
      ...createInitialState(),
      player1Pits: [0, 0, 0, 0, 1],
      player2Pits: [0, 0, 0, 0, 0],
      player1Calla: 14,
      player2Calla: 15, // after sweep p1 gets +1 → 15 vs 15
    };
    const next = makeMove(state, 4);
    // last cube into calla? pit4 with 1 cube goes to calla (position 5) → free turn + empty side
    expect(isGameOver(next)).toBe(true);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('tie');
    expect(getPhaseMessage(next)).toBe("It's a tie!");
  });
});
