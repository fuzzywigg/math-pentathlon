/**
 * Wave 42 — Kings pieces + board helpers (createKing/Quad, empty, supply). Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createKing,
  createQuadraphage,
  INITIAL_QUADRAPHAGE_COUNT,
} from '../../src/games/kings-quadraphages/pieces';
import {
  createInitialGameState as createBoardState,
  createInitialBoard,
  isValidPosition,
  isEmpty,
  getPiece,
  getSupply,
  hasSupply,
  fromOneBasedPosition,
  BOARD_SIZE,
  PLAYER1_KING_START,
  PLAYER2_KING_START,
} from '../../src/games/kings-quadraphages/board';

describe('Wave 42 kings — pieces / board helpers', () => {
  it('createKing / createQuadraphage set type and owner', () => {
    expect(createKing('player1')).toEqual({ type: 'king', owner: 'player1' });
    expect(createQuadraphage('player2')).toEqual({
      type: 'quadraphage',
      owner: 'player2',
    });
    expect(INITIAL_QUADRAPHAGE_COUNT).toBe(30);
  });

  it('board opening places kings at documented starts', () => {
    const state = createBoardState();
    expect(getPiece(state.board, PLAYER1_KING_START)?.type).toBe('king');
    expect(getPiece(state.board, PLAYER1_KING_START)?.owner).toBe('player1');
    expect(getPiece(state.board, PLAYER2_KING_START)?.owner).toBe('player2');
    expect(isEmpty(state.board, { row: 4, col: 4 })).toBe(true);
    expect(createInitialBoard()).toHaveLength(BOARD_SIZE);
  });

  it('isValidPosition / isEmpty / getPiece OOB behave safely', () => {
    const state = createBoardState();
    expect(isValidPosition({ row: 0, col: 0 })).toBe(true);
    expect(isValidPosition({ row: -1, col: 0 })).toBe(false);
    expect(isValidPosition({ row: 9, col: 0 })).toBe(false);
    expect(getPiece(state.board, { row: -1, col: 0 })).toBeNull();
    expect(isEmpty(state.board, { row: -1, col: 0 })).toBe(false);
    expect(isEmpty(state.board, PLAYER1_KING_START)).toBe(false);
  });

  it('getSupply / hasSupply mirror INITIAL count', () => {
    const state = createBoardState();
    expect(getSupply(state, 'player1')).toBe(INITIAL_QUADRAPHAGE_COUNT);
    expect(getSupply(state, 'player2')).toBe(INITIAL_QUADRAPHAGE_COUNT);
    expect(hasSupply(state, 'player1')).toBe(true);
    expect(hasSupply({ ...state, player1Supply: 0 }, 'player1')).toBe(false);
    expect(fromOneBasedPosition(1, 5)).toEqual(PLAYER1_KING_START);
  });
});
