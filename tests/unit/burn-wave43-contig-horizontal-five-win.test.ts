/**
 * Wave 43 — Contig horizontal five-in-a-row leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/contig-60/types';
import { checkWinner } from '../../src/games/contig-60/rules';

describe('Wave 43 contig — horizontal five win', () => {
  it('row of five owned cells wins for player1', () => {
    const state = createInitialState();
    for (let col = 0; col < 5; col++) {
      const value = state.grid[2][col]!;
      state.cells.get(value)!.owner = 'player1';
    }
    expect(checkWinner(state)).toBe('player1');
  });
});
