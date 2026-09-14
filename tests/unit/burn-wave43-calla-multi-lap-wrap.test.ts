/**
 * Wave 43 — Calla multi-lap wrap leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, type CallaGameState } from '../../src/games/calla/types';
import { makeMove } from '../../src/games/calla/rules';

function base(o: Partial<CallaGameState> = {}): CallaGameState {
  return { ...createInitialState(), ...o };
}

describe('Wave 43 calla — multi-lap wrap', () => {
  it('11+ cubes wrap past opponent calla skip and set lastSownSide', () => {
    const state = base({
      player1Pits: [11, 0, 0, 0, 0],
      player2Pits: [1, 1, 1, 1, 1],
      player1Calla: 0,
      player2Calla: 0,
    });
    const next = makeMove(state, 0);
    expect(next.player1Pits[0]).toBe(0);
    expect(next.moveHistory[0].cubesDistributed).toBe(11);
    expect(next.lastSownPit).not.toBeNull();
    expect(['player1', 'player2', 'calla']).toContain(next.lastSownPit!.side);
  });
});
