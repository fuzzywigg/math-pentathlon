/**
 * Wave 42 — Kings isValidKingMove stay / OOB / occupied leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  isValidKingMove,
  findKingPosition,
} from '../../src/games/kings-quadraphages/rules';
import {
  createInitialGameState,
  type GameState,
} from '../../src/games/kings-quadraphages/game-state';

describe('Wave 42 kings — isValidKingMove edge leftovers', () => {
  it('stay-in-place false for both seats', () => {
    const state = createInitialGameState();
    const p1 = findKingPosition(state.board, 'player1')!;
    const p2 = findKingPosition(state.board, 'player2')!;
    expect(isValidKingMove(state, 'player1', p1)).toBe(false);
    expect(isValidKingMove(state, 'player2', p2)).toBe(false);
  });

  it('corner OOB and below-zero col reject', () => {
    const state = createInitialGameState();
    expect(isValidKingMove(state, 'player2', { row: 8, col: -1 })).toBe(false);
    expect(isValidKingMove(state, 'player2', { row: 9, col: 4 })).toBe(false);
    expect(isValidKingMove(state, 'player1', { row: -1, col: 5 })).toBe(false);
  });

  it('occupied by quadraphage adjacent is false', () => {
    const state = createInitialGameState();
    const board = state.board.map((row) =>
      row.map((c) => (c ? { ...c } : null))
    );
    board[1][4] = { type: 'quadraphage', owner: 'player2' };
    const blocked: GameState = { ...state, board };
    expect(isValidKingMove(blocked, 'player1', { row: 1, col: 4 })).toBe(
      false
    );
    expect(isValidKingMove(blocked, 'player1', { row: 1, col: 5 })).toBe(true);
  });
});
