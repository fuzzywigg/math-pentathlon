/**
 * Wave 42 leftovers B — Kings board getPiece OOB / supply zero matrix.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialGameState,
  getPiece,
  isEmpty,
  isValidPosition,
  getSupply,
  hasSupply,
  PLAYER1_KING_START,
} from '../../src/games/kings-quadraphages/board';

describe('Wave 42 kings — board OOB / supply matrix', () => {
  it('OOB helpers and depleted supply', () => {
    const state = createInitialGameState();
    expect(isValidPosition({ row: 0, col: 0 })).toBe(true);
    expect(isValidPosition({ row: 8, col: 8 })).toBe(true);
    expect(isValidPosition({ row: -1, col: 4 })).toBe(false);
    expect(isValidPosition({ row: 4, col: 9 })).toBe(false);
    expect(getPiece(state.board, { row: 100, col: 100 })).toBeNull();
    expect(isEmpty(state.board, { row: 100, col: 0 })).toBe(false);
    expect(isEmpty(state.board, PLAYER1_KING_START)).toBe(false);

    const emptyP1 = { ...state, player1Supply: 0 };
    expect(getSupply(emptyP1, 'player1')).toBe(0);
    expect(hasSupply(emptyP1, 'player1')).toBe(false);
    expect(hasSupply(emptyP1, 'player2')).toBe(true);
  });
});
