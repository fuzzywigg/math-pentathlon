/**
 * Wave 42 — Kings 1-based game-state vs 0-based rules index bridge. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  fromOneBasedPosition,
  toOneBasedPosition,
  PLAYER1_KING_START,
  PLAYER2_KING_START,
  BOARD_SIZE,
} from '../../src/games/kings-quadraphages/board';
import {
  findKingPosition,
  isValidKingMove,
} from '../../src/games/kings-quadraphages/rules';
import {
  createInitialGameState,
  getKingPosition,
  isValidMove,
} from '../../src/games/kings-quadraphages/game-state';

describe('Wave 42 kings — one-based index bridge', () => {
  it('fromOneBased / toOneBased roundtrip on corners and center', () => {
    expect(fromOneBasedPosition(1, 1)).toEqual({ row: 0, col: 0 });
    expect(fromOneBasedPosition(9, 9)).toEqual({ row: 8, col: 8 });
    expect(fromOneBasedPosition(5, 5)).toEqual({ row: 4, col: 4 });
    expect(toOneBasedPosition({ row: 0, col: 4 })).toEqual({ row: 1, col: 5 });
    expect(toOneBasedPosition({ row: 8, col: 4 })).toEqual({ row: 9, col: 5 });
  });

  it('opening kings: rules 0-based matches game-state 1-based', () => {
    const state = createInitialGameState();
    const p1Rules = findKingPosition(state.board, 'player1')!;
    const p1Ui = getKingPosition(state, 'player1')!;
    expect(p1Rules).toEqual(PLAYER1_KING_START);
    expect(p1Ui).toEqual(toOneBasedPosition(p1Rules));
    expect(p1Ui).toEqual({ row: 1, col: 5 });

    const p2Rules = findKingPosition(state.board, 'player2')!;
    const p2Ui = getKingPosition(state, 'player2')!;
    expect(p2Rules).toEqual(PLAYER2_KING_START);
    expect(p2Ui).toEqual(toOneBasedPosition(p2Rules));
    expect(p2Ui).toEqual({ row: 9, col: 5 });
  });

  it('isValidMove (1-based) agrees with isValidKingMove (0-based)', () => {
    const state = createInitialGameState();
    // Adjacent down from P1 king: UI (2,5) ↔ rules (1,4)
    expect(isValidMove(state, { row: 2, col: 5 })).toBe(true);
    expect(isValidKingMove(state, 'player1', { row: 1, col: 4 })).toBe(true);
    // Mixing: do NOT pass 1-based into rules
    expect(isValidKingMove(state, 'player1', { row: 2, col: 5 })).toBe(false);
    // Far leap false in both spaces
    expect(isValidMove(state, { row: 5, col: 5 })).toBe(false);
    expect(isValidKingMove(state, 'player1', { row: 4, col: 4 })).toBe(false);
  });

  it('board size constant is 9 for both index spaces', () => {
    expect(BOARD_SIZE).toBe(9);
    const state = createInitialGameState();
    expect(state.board).toHaveLength(9);
    expect(state.board[0]).toHaveLength(9);
  });
});
