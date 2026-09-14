/**
 * Wave 42 — Hex connection game winning path (not hex-a-gone / #187). Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  makeMove,
  checkWinner,
  getWinningPath,
  getValidMoves,
  getNeighbors,
} from '../../src/games/hex/rules';
import { createInitialState, createEmptyBoard } from '../../src/games/hex/types';

describe('Wave 42 hex-game — winning path', () => {
  it('player1 top-bottom column wins with path length boardSize', () => {
    const size = 5;
    let s = createInitialState(size);
    for (let row = 0; row < size; row++) {
      s = makeMove(s, { row, col: 2 });
      if (row < size - 1) {
        // opponent plays elsewhere
        s = makeMove(s, { row, col: 0 });
      }
    }
    expect(s.winner).toBe('player1');
    expect(checkWinner(s.board, 'player1', size)).toBe(true);
    const path = getWinningPath(s.board, 'player1', size);
    expect(path.length).toBe(size);
    expect(path.some((p) => p.row === 0)).toBe(true);
    expect(path.some((p) => p.row === size - 1)).toBe(true);
  });

  it('player2 left-right wins', () => {
    const size = 4;
    let s = createInitialState(size);
    // p1 plays first — give p2 the row connect by alternating carefully
    // Force board: fill row 1 cols 0..3 with player2
    const board = createEmptyBoard(size);
    for (let col = 0; col < size; col++) board[1][col] = 'player2';
    expect(checkWinner(board, 'player2', size)).toBe(true);
    const path = getWinningPath(board, 'player2', size);
    expect(path.length).toBe(size);
  });

  it('empty board path empty; corner neighbors ≤3', () => {
    const s = createInitialState(5);
    expect(getWinningPath(s.board, 'player1', 5)).toEqual([]);
    expect(getNeighbors({ row: 0, col: 0 }, 5).length).toBeLessThanOrEqual(3);
    expect(getValidMoves(s).length).toBe(25);
  });
});
