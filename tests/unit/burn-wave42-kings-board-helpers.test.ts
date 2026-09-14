/**
 * Wave 42 — Kings board helpers isValidPosition / isEmpty leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  isValidPosition,
  isEmpty,
  createInitialGameState,
  BOARD_SIZE,
  PLAYER1_KING_START,
  PLAYER2_KING_START,
  fromOneBasedPosition,
  toOneBasedPosition,
} from '../../src/games/kings-quadraphages/board';

describe('Wave 42 kings — board helpers', () => {
  it('isValidPosition bounds and BOARD_SIZE 9', () => {
    expect(BOARD_SIZE).toBe(9);
    expect(isValidPosition({ row: 0, col: 0 })).toBe(true);
    expect(isValidPosition({ row: 8, col: 8 })).toBe(true);
    expect(isValidPosition({ row: -1, col: 0 })).toBe(false);
    expect(isValidPosition({ row: 0, col: 9 })).toBe(false);
  });

  it('isEmpty true for empty; false on king starts', () => {
    const { board } = createInitialGameState();
    expect(isEmpty(board, { row: 4, col: 4 })).toBe(true);
    expect(isEmpty(board, PLAYER1_KING_START)).toBe(false);
    expect(isEmpty(board, PLAYER2_KING_START)).toBe(false);
    expect(isEmpty(board, { row: -1, col: 0 })).toBe(false);
  });

  it('fromOneBased / toOneBased roundtrip opening kings', () => {
    expect(fromOneBasedPosition(1, 5)).toEqual(PLAYER1_KING_START);
    expect(fromOneBasedPosition(9, 5)).toEqual(PLAYER2_KING_START);
    expect(toOneBasedPosition(PLAYER1_KING_START)).toEqual({
      row: 1,
      col: 5,
    });
  });
});
