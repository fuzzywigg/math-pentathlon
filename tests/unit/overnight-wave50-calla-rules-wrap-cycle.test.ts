/**
 * Overnight HEAVY leftover — Calla wrap-around sow past opponent pits.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, TOTAL_CUBES } from '../../src/games/calla/types';
import { makeMove } from '../../src/games/calla/rules';

describe('Overnight wave50 calla — wrap cycle sow', () => {
  it('12 cubes from pit 4 wrap through opponent pits back to own calla', () => {
    const state = {
      ...createInitialState(),
      player1Pits: [0, 0, 0, 0, 12],
      player2Pits: [1, 1, 1, 1, 1],
      player1Calla: 0,
      player2Calla: 0,
    };
    const next = makeMove(state, 4);
    expect(next.player1Pits[4]).toBe(1); // emptied then received wrap-around cube
    expect(next.player1Calla).toBe(2); // calla twice in a 12-step wrap
    expect(next.moveHistory[0].cubesDistributed).toBe(12);
    expect(next.moveHistory[0].gotFreeTurn).toBe(true);
    expect(next.lastSownPit).toEqual({ side: 'calla', index: 0 });
    expect(next.currentPlayer).toBe('player1');
    const total =
      next.player1Pits.reduce((a, b) => a + b, 0) +
      next.player2Pits.reduce((a, b) => a + b, 0) +
      next.player1Calla +
      next.player2Calla;
    expect(total).toBe(12 + 5);
    expect(TOTAL_CUBES).toBe(30);
  });
});
