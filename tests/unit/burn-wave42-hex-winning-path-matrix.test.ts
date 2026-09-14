/**
 * Wave 42 leftovers B — Hex game getWinningPath reconstruction (not hex-a-gone).
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  createEmptyBoard,
  type HexBoard,
} from '../../src/games/hex/types';
import {
  getWinningPath,
  checkWinner,
  makeMove,
  isCellEmpty,
} from '../../src/games/hex/rules';

function fillColumn(board: HexBoard, col: number, player: 'player1' | 'player2') {
  for (let row = 0; row < board.length; row++) {
    board[row][col] = player;
  }
}

function fillRow(board: HexBoard, row: number, player: 'player1' | 'player2') {
  for (let col = 0; col < board.length; col++) {
    board[row][col] = player;
  }
}

describe('Wave 42 hex — getWinningPath', () => {
  it('empty when no winner', () => {
    const state = createInitialState(5);
    expect(getWinningPath(state.board, 'player1', 5)).toEqual([]);
    expect(getWinningPath(state.board, 'player2', 5)).toEqual([]);
  });

  it('player1 top→bottom path contiguous length ≥ size', () => {
    const board = createEmptyBoard(5);
    fillColumn(board, 2, 'player1');
    expect(checkWinner(board, 'player1', 5)).toBe(true);
    const path = getWinningPath(board, 'player1', 5);
    expect(path.length).toBeGreaterThanOrEqual(5);
    expect(path.some((p) => p.row === 0)).toBe(true);
    expect(path.some((p) => p.row === 4)).toBe(true);
    for (const cell of path) {
      expect(board[cell.row][cell.col]).toBe('player1');
    }
  });

  it('player2 left→right path contiguous', () => {
    const board = createEmptyBoard(5);
    fillRow(board, 2, 'player2');
    expect(checkWinner(board, 'player2', 5)).toBe(true);
    const path = getWinningPath(board, 'player2', 5);
    expect(path.length).toBeGreaterThanOrEqual(5);
    expect(path.some((p) => p.col === 0)).toBe(true);
    expect(path.some((p) => p.col === 4)).toBe(true);
  });

  it('isCellEmpty false after makeMove; identity reject occupied', () => {
    let state = createInitialState(5);
    state = makeMove(state, { row: 2, col: 2 });
    expect(isCellEmpty(state.board, { row: 2, col: 2 })).toBe(false);
    const same = makeMove(state, { row: 2, col: 2 });
    expect(same).toBe(state);
  });
});
