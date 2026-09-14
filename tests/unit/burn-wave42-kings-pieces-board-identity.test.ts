/**
 * Wave 42 leftovers B — Kings pieces factories + board identity helpers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createKing,
  createQuadraphage,
  INITIAL_QUADRAPHAGE_COUNT,
} from '../../src/games/kings-quadraphages/pieces';
import {
  BOARD_SIZE,
  PLAYER1_KING_START,
  PLAYER2_KING_START,
  fromOneBasedPosition,
  toOneBasedPosition,
  createInitialGameState,
  createInitialBoard,
  isValidPosition,
  getPiece,
  isEmpty,
  getSupply,
  hasSupply,
} from '../../src/games/kings-quadraphages/board';

describe('Wave 42 kings — pieces / board identity', () => {
  it('factories set type/owner; supply constant 30', () => {
    expect(createKing('player1')).toEqual({ type: 'king', owner: 'player1' });
    expect(createQuadraphage('player2')).toEqual({
      type: 'quadraphage',
      owner: 'player2',
    });
    expect(INITIAL_QUADRAPHAGE_COUNT).toBe(30);
  });

  it('one-based ↔ zero-based roundtrip corners/center', () => {
    expect(fromOneBasedPosition(1, 1)).toEqual({ row: 0, col: 0 });
    expect(fromOneBasedPosition(9, 9)).toEqual({ row: 8, col: 8 });
    expect(fromOneBasedPosition(5, 5)).toEqual({ row: 4, col: 4 });
    expect(toOneBasedPosition({ row: 0, col: 4 })).toEqual({ row: 1, col: 5 });
    expect(toOneBasedPosition(PLAYER1_KING_START)).toEqual({ row: 1, col: 5 });
    expect(toOneBasedPosition(PLAYER2_KING_START)).toEqual({ row: 9, col: 5 });
  });

  it('opening board places kings; empty elsewhere; supply helpers', () => {
    const state = createInitialGameState();
    expect(BOARD_SIZE).toBe(9);
    expect(state.board).toHaveLength(9);
    expect(getPiece(state.board, PLAYER1_KING_START)?.type).toBe('king');
    expect(getPiece(state.board, PLAYER2_KING_START)?.owner).toBe('player2');
    expect(isEmpty(state.board, { row: 4, col: 4 })).toBe(true);
    expect(isEmpty(state.board, PLAYER1_KING_START)).toBe(false);
    expect(getPiece(state.board, { row: -1, col: 0 })).toBeNull();
    expect(isValidPosition({ row: 9, col: 0 })).toBe(false);
    expect(getSupply(state, 'player1')).toBe(30);
    expect(hasSupply(state, 'player2')).toBe(true);
    expect(hasSupply({ ...state, player2Supply: 0 }, 'player2')).toBe(false);
    expect(createInitialBoard()[0][4]?.owner).toBe('player1');
  });
});
