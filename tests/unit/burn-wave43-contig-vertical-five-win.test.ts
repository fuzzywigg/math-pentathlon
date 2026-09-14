/**
 * Wave 43 — Contig vertical five-in-a-row leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/contig-60/types';
import { checkWinner } from '../../src/games/contig-60/rules';

describe('Wave 43 contig — vertical five win', () => {
  it('column of five owned cells wins', () => {
    const state = createInitialState();
    for (let row = 0; row < 5; row++) {
      const value = state.grid[row][0]!;
      state.cells.get(value)!.owner = 'player2';
    }
    expect(checkWinner(state)).toBe('player2');
  });
});
