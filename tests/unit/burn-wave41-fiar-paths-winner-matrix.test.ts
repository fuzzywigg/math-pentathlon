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
  nodeId,
  type FiarGameState,
} from '../../src/games/fiar/types';

function withSpaces(
  player: 'player1' | 'player2',
  spaces: Array<{ col: number; row: number }>,
  blocker?: { col: number; row: number; owner: 'player1' | 'player2' }
): FiarGameState {
  const state = createInitialState();
  const nodes = new Map(state.board.nodes);
  for (const s of spaces) {
    const id = nodeId(s.col, s.row);
    nodes.set(id, { ...nodes.get(id)!, chip: player, chipKind: 'plain' });
  }
  if (blocker) {
    const id = nodeId(blocker.col, blocker.row);
    nodes.set(id, {
      ...nodes.get(id)!,
      chip: blocker.owner,
      chipKind: 'marked',
    });
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
    const state = withSpaces('player1', [
      { col: 0, row: 3 },
      { col: 1, row: 3 },
      { col: 2, row: 3 },
      { col: 3, row: 3 },
    ]);
    const paths = findPaths(state, 'player1');
    expect(paths.some((p) => p.nodes.length >= CONFIG.WIN_LENGTH)).toBe(true);
    expect(checkWinner(state)).toBe('player1');
  });

  it('four in a row with adjacent opponent → blocked, no winner', () => {
    const state = withSpaces(
      'player1',
      [
        { col: 1, row: 2 },
        { col: 2, row: 2 },
        { col: 3, row: 2 },
        { col: 4, row: 2 },
      ],
      { col: 1, row: 1, owner: 'player2' }
    );
    const path = ['c1r2', 'c2r2', 'c3r2', 'c4r2'];
    expect(isPathBlocked(state, path, 'player1')).toBe(true);
    const paths = findPaths(state, 'player1');
    const winLen = paths.filter((p) => p.nodes.length >= CONFIG.WIN_LENGTH);
    expect(winLen.every((p) => p.isBlocked)).toBe(true);
    expect(checkWinner(state)).toBeNull();
  });

  it('three in a row never wins', () => {
    const state = withSpaces('player2', [
      { col: 1, row: 4 },
      { col: 2, row: 4 },
      { col: 3, row: 4 },
    ]);
    expect(findPaths(state, 'player2').every((p) => p.nodes.length < 4)).toBe(
      true
    );
    expect(checkWinner(state)).toBeNull();
  });

  it('empty board paths empty; isPathBlocked false on empty path nodes', () => {
    const state = createInitialState();
    expect(findPaths(state, 'player1')).toEqual([]);
    expect(isPathBlocked(state, ['c1r2', 'c2r2'], 'player1')).toBe(false);
  });
});
