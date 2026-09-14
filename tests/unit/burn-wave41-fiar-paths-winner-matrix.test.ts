/**
 * Wave 41 — FIAR findPaths / checkWinner / isPathBlocked win matrix. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  findPaths,
  checkWinner,
  isPathBlocked,
} from '../../src/games/fiar/rules';
import {
  createInitialState,
  CONFIG,
  type FiarGameState,
} from '../../src/games/fiar/types';

function withRow(
  player: 'player1' | 'player2',
  row: number,
  cols: number[],
  blocker?: { row: number; col: number; owner: 'player1' | 'player2' }
): FiarGameState {
  const state = createInitialState();
  const nodes = new Map(state.board.nodes);
  for (const col of cols) {
    const id = `${row}-${col}`;
    nodes.set(id, { ...nodes.get(id)!, chip: player });
  }
  if (blocker) {
    const id = `${blocker.row}-${blocker.col}`;
    nodes.set(id, { ...nodes.get(id)!, chip: blocker.owner });
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

describe('Wave 41 fiar — paths / winner matrix', () => {
  it('four in a row unblocked → checkWinner', () => {
    const state = withRow('player1', 0, [0, 1, 2, 3]);
    const paths = findPaths(state, 'player1');
    expect(paths.some((p) => p.nodes.length >= CONFIG.WIN_LENGTH)).toBe(true);
    expect(checkWinner(state)).toBe('player1');
  });

  it('four in a row with adjacent opponent → blocked, no winner', () => {
    const state = withRow('player1', 2, [0, 1, 2, 3], {
      row: 1,
      col: 1,
      owner: 'player2',
    });
    const path = ['2-0', '2-1', '2-2', '2-3'];
    expect(isPathBlocked(state, path, 'player1')).toBe(true);
    const paths = findPaths(state, 'player1');
    const winLen = paths.filter((p) => p.nodes.length >= CONFIG.WIN_LENGTH);
    expect(winLen.every((p) => p.isBlocked)).toBe(true);
    expect(checkWinner(state)).toBeNull();
  });

  it('three in a row never wins', () => {
    const state = withRow('player2', 4, [0, 1, 2]);
    expect(findPaths(state, 'player2').every((p) => p.nodes.length < 4)).toBe(
      true
    );
    expect(checkWinner(state)).toBeNull();
  });

  it('empty board paths empty; isPathBlocked false on empty path nodes', () => {
    const state = createInitialState();
    expect(findPaths(state, 'player1')).toEqual([]);
    expect(isPathBlocked(state, ['0-0', '0-1'], 'player1')).toBe(false);
  });
});
