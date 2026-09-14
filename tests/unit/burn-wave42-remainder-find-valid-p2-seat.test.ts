/**
 * Wave 42 — Remainder Islands findValidIslands player2 seat leftovers.
 * Beyond wave41 p1 ownership filter. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/remainder-islands/types';
import { findValidIslands } from '../../src/games/remainder-islands/rules';

describe('Wave 42 remainder — findValid player2 seat', () => {
  it('player2 may reinforce own islands', () => {
    const base = createInitialState();
    const islands = base.islands.map((i, idx) =>
      idx === 0 ? { ...i, owner: 'player2' as const, chips: 1 } : i
    );
    const state = {
      ...base,
      currentPlayer: 'player2' as const,
      islands,
    };
    const ids = findValidIslands(state, 7);
    expect(ids).toContain(islands[0].id);
  });

  it('player2 blocked from all player1 islands only', () => {
    const base = createInitialState();
    const islands = base.islands.map((i) => ({
      ...i,
      owner: 'player1' as const,
    }));
    const state = {
      ...base,
      currentPlayer: 'player2' as const,
      islands,
    };
    expect(findValidIslands(state, 9)).toEqual([]);
  });

  it('total argument does not shrink open-board valids', () => {
    const state = createInitialState();
    const a = findValidIslands(state, 2);
    const b = findValidIslands(state, 12);
    expect(a).toEqual(b);
    expect(a).toHaveLength(state.islands.length);
  });
});
