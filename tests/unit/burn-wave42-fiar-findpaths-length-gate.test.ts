/**
 * Wave 42 — FIAR findPaths ignores short lines; returns length >= 4. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { findPaths } from '../../src/games/fiar/rules';
import {
  createInitialState,
  CONFIG,
  type FiarGameState,
} from '../../src/games/fiar/types';

function withCols(
  player: 'player1' | 'player2',
  row: number,
  cols: number[]
): FiarGameState {
  const state = createInitialState();
  const nodes = new Map(state.board.nodes);
  for (const col of cols) {
    const id = `${row}-${col}`;
    nodes.set(id, { ...nodes.get(id)!, chip: player });
  }
  return {
    ...state,
    board: { ...state.board, nodes },
    phase: 'movement',
    chipsPlaced: {
      player1: CONFIG.CHIPS_PER_PLAYER,
      player2: CONFIG.CHIPS_PER_PLAYER,
    },
  };
}

describe('Wave 42 fiar — findPaths length gate', () => {
  it('length 2 and 3 alignments are ignored (empty path list)', () => {
    expect(findPaths(withCols('player1', 1, [0, 1]), 'player1')).toEqual([]);
    expect(findPaths(withCols('player1', 1, [0, 1, 2]), 'player1')).toEqual([]);
  });

  it('length >= WIN_LENGTH paths are returned', () => {
    const state = withCols('player2', 3, [0, 1, 2, 3]);
    const paths = findPaths(state, 'player2');
    expect(paths.length).toBeGreaterThan(0);
    expect(paths.every((p) => p.nodes.length >= CONFIG.WIN_LENGTH)).toBe(true);
  });

  it('five-long row still yields path entries of length >= 4', () => {
    const state = withCols('player1', 0, [0, 1, 2, 3, 4]);
    const paths = findPaths(state, 'player1');
    expect(paths.some((p) => p.nodes.length >= 4)).toBe(true);
  });
});
