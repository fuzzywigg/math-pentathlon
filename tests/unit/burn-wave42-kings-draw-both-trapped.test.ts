/**
 * Wave 42 — Kings isDrawCondition false opening; both trapped true.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  isDrawCondition,
  getValidKingMoves,
  checkWinCondition,
} from '../../src/games/kings-quadraphages/rules';
import {
  createInitialGameState,
  type GameState,
} from '../../src/games/kings-quadraphages/game-state';

function fillAllNonKings(state: GameState): GameState {
  const board = state.board.map((row) => row.map((c) => (c ? { ...c } : null)));
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c]?.type === 'king') continue;
      board[r][c] = { type: 'quadraphage', owner: 'player1' };
    }
  }
  return { ...state, board };
}

describe('Wave 42 kings — isDrawCondition leftovers', () => {
  it('opening is not a draw', () => {
    expect(isDrawCondition(createInitialGameState())).toBe(false);
  });

  it('both kings fully surrounded → draw true', () => {
    const both = fillAllNonKings(createInitialGameState());
    expect(getValidKingMoves(both, 'player1')).toHaveLength(0);
    expect(getValidKingMoves(both, 'player2')).toHaveLength(0);
    expect(isDrawCondition(both)).toBe(true);
  });

  it('single trap is win not draw', () => {
    const state = createInitialGameState();
    const board = state.board.map((row) =>
      row.map((c) => (c ? { ...c } : null))
    );
    // Surround only player2 (edge king has 5 neighbors)
    for (const [r, c] of [
      [7, 3],
      [7, 4],
      [7, 5],
      [8, 3],
      [8, 5],
    ] as const) {
      board[r][c] = { type: 'quadraphage', owner: 'player1' };
    }
    const p2Only: GameState = { ...state, board };
    expect(isDrawCondition(p2Only)).toBe(false);
    expect(checkWinCondition(p2Only)).toBe('player1');
  });
});
