/**
 * Wave 55 leftover after #250 — Kings findKingPosition / isValidKingMove without a king. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialGameState } from '../../src/games/kings-quadraphages/board';
import {
  findKingPosition,
  isValidKingMove,
} from '../../src/games/kings-quadraphages/rules';

describe('Wave 55 kings — missing king rules', () => {
  it('empty board: no king and dest reject', () => {
    const state = createInitialGameState();
    state.board = state.board.map((row) => row.map(() => null));
    expect(findKingPosition(state.board, 'player1')).toBeNull();
    expect(isValidKingMove(state, 'player1', { row: 4, col: 4 })).toBe(false);
  });
});
