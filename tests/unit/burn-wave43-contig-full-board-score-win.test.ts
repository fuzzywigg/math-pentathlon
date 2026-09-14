/**
 * Wave 43 — Contig full-board score win leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/contig-60/types';
import { checkWinner } from '../../src/games/contig-60/rules';

function fillWithoutFive(state: ReturnType<typeof createInitialState>) {
  // Break both axes: alternate by column within top/bottom halves swapped
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 10; c++) {
      const v = state.grid[r][c]!;
      const owner =
        r < 3
          ? c % 2 === 0
            ? 'player1'
            : 'player2'
          : c % 2 === 0
            ? 'player2'
            : 'player1';
      state.cells.get(v)!.owner = owner;
    }
  }
}

describe('Wave 43 contig — full board score win', () => {
  it('full board awards higher score; equal scores null', () => {
    const state = createInitialState();
    fillWithoutFive(state);
    state.scores = { player1: 20, player2: 11 };
    expect(checkWinner(state)).toBe('player1');

    const equal = createInitialState();
    fillWithoutFive(equal);
    equal.scores = { player1: 15, player2: 15 };
    expect(checkWinner(equal)).toBeNull();
  });
});
