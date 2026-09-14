/**
 * Wave 42 — Hex game getWinningPath reconstruct leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createEmptyBoard } from '../../src/games/hex/types';
import { getWinningPath, checkWinner } from '../../src/games/hex/rules';

describe('Wave 42 hex game — winning path', () => {
  it('empty when no winner', () => {
    const board = createEmptyBoard(5);
    expect(getWinningPath(board, 'player1', 5)).toEqual([]);
    expect(getWinningPath(board, 'player2', 5)).toEqual([]);
  });

  it('player1 path spans top to bottom', () => {
    const size = 3;
    const board = createEmptyBoard(size);
    for (let r = 0; r < size; r++) board[r][1] = 'player1';
    expect(checkWinner(board, 'player1', size)).toBe(true);
    const path = getWinningPath(board, 'player1', size);
    expect(path.length).toBeGreaterThanOrEqual(size);
    expect(path.some((p) => p.row === 0)).toBe(true);
    expect(path.some((p) => p.row === size - 1)).toBe(true);
  });

  it('player2 path spans left to right', () => {
    const size = 3;
    const board = createEmptyBoard(size);
    for (let c = 0; c < size; c++) board[1][c] = 'player2';
    const path = getWinningPath(board, 'player2', size);
    expect(path.length).toBeGreaterThanOrEqual(size);
    expect(path.some((p) => p.col === 0)).toBe(true);
    expect(path.some((p) => p.col === size - 1)).toBe(true);
    expect(getWinningPath(board, 'player1', size)).toEqual([]);
  });
});
