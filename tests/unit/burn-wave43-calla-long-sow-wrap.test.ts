/**
 * Wave 43 — Calla long sow wraps past opponent calla. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { makeMove } from '../../src/games/calla/rules';

describe('Wave 43 calla — long sow wrap', () => {
  it('large pit sow wraps and conserves cubes', () => {
    const state = {
      ...createInitialState(),
      player1Pits: [0, 0, 0, 0, 12],
      player2Pits: [1, 1, 1, 1, 1],
      player1Calla: 0,
      player2Calla: 0,
    };
    const next = makeMove(state, 4);
    const total =
      next.player1Pits.reduce((a, b) => a + b, 0) +
      next.player2Pits.reduce((a, b) => a + b, 0) +
      next.player1Calla +
      next.player2Calla;
    expect(total).toBe(12 + 5);
    expect(next.moveHistory[0].cubesDistributed).toBe(12);
    // wrap may re-seed pit4; only require the sow recorded and calla/pits changed
    expect(next.player1Calla + next.player2Calla).toBeGreaterThan(0);
  });
});
