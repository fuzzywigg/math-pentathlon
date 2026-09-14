/**
 * Wave 42 — Hex game isValidPosition / isCellEmpty matrix.
 * Tests-only. Hex GAME (src/games/hex), not hex-a-gone.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  createEmptyBoard,
} from '../../src/games/hex/types';
import {
  isValidPosition,
  isCellEmpty,
  makeMove,
} from '../../src/games/hex/rules';

describe('Wave 42 hex game — position / empty matrix', () => {
  it('corners in-bounds; negatives and size OOB', () => {
    const size = createInitialState(5).boardSize;
    expect(isValidPosition({ row: 0, col: 0 }, size)).toBe(true);
    expect(isValidPosition({ row: size - 1, col: size - 1 }, size)).toBe(true);
    expect(isValidPosition({ row: -1, col: 0 }, size)).toBe(false);
    expect(isValidPosition({ row: 0, col: -1 }, size)).toBe(false);
    expect(isValidPosition({ row: size, col: 0 }, size)).toBe(false);
    expect(isValidPosition({ row: 0, col: size }, size)).toBe(false);
  });

  it('isCellEmpty true on fresh board; false after occupy', () => {
    const board = createEmptyBoard(4);
    expect(isCellEmpty(board, { row: 1, col: 2 })).toBe(true);
    board[1][2] = 'player1';
    expect(isCellEmpty(board, { row: 1, col: 2 })).toBe(false);
  });

  it('makeMove marks cell occupied for current seat', () => {
    const state = createInitialState(5);
    const next = makeMove(state, { row: 2, col: 3 });
    expect(isCellEmpty(next.board, { row: 2, col: 3 })).toBe(false);
    expect(next.board[2][3]).toBe('player1');
  });
});
