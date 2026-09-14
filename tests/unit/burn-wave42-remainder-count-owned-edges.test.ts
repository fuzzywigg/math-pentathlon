/**
 * Wave 42 — Remainder Islands countOwnedIslands edge tallies.
 * Beyond wave41 mixed-owner matrix. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/remainder-islands/types';
import { countOwnedIslands } from '../../src/games/remainder-islands/rules';

describe('Wave 42 remainder — countOwned edges', () => {
  it('opening board is all unowned zeros', () => {
    expect(countOwnedIslands(createInitialState())).toEqual({
      player1: 0,
      player2: 0,
    });
  });

  it('all player1 owned → player2 zero', () => {
    const state = createInitialState();
    const islands = state.islands.map((i) => ({
      ...i,
      owner: 'player1' as const,
    }));
    expect(countOwnedIslands({ ...state, islands })).toEqual({
      player1: islands.length,
      player2: 0,
    });
  });

  it('all player2 owned → player1 zero', () => {
    const state = createInitialState();
    const islands = state.islands.map((i) => ({
      ...i,
      owner: 'player2' as const,
    }));
    expect(countOwnedIslands({ ...state, islands })).toEqual({
      player1: 0,
      player2: islands.length,
    });
  });
});
