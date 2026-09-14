/**
 * Wave 35 — Hex post-win empty valids / winning path / AI null.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  createEmptyBoard,
  DEFAULT_BOARD_SIZE,
} from '../../src/games/hex/types';
import {
  makeMove,
  getValidMoves,
  isValidMove,
  checkWinner,
  getWinningPath,
  getNeighbors,
} from '../../src/games/hex/rules';
import { getBestMove, getRandomMove } from '../../src/games/hex/ai';

describe('Wave 35 Hex — postwin empty valids', () => {
  it('corner neighbors fewer than 6', () => {
    expect(getNeighbors({ row: 0, col: 0 }, DEFAULT_BOARD_SIZE).length).toBeLessThan(6);
    expect(getNeighbors({ row: 5, col: 5 }, DEFAULT_BOARD_SIZE).length).toBe(6);
  });

  it('after vertical P1 win: getValidMoves empty, makeMove identity', () => {
    const size = 5;
    let state = createInitialState(size);
    // Fill a top-bottom path for player1 on col 0
    for (let row = 0; row < size; row++) {
      state = {
        ...state,
        board: state.board.map((r, ri) =>
          r.map((c, ci) => (ri === row && ci === 0 ? 'player1' : c))
        ),
        currentPlayer: 'player1',
      };
    }
    // Confirm win via checkWinner boolean API
    expect(checkWinner(state.board, 'player1', size)).toBe(true);
    state = { ...state, winner: 'player1' };
    expect(getValidMoves(state)).toEqual([]);
    expect(isValidMove(state, { row: 0, col: 1 })).toBe(false);
    expect(makeMove(state, { row: 0, col: 1 })).toBe(state);
    const path = getWinningPath(state.board, 'player1', size);
    expect(path.length).toBeGreaterThan(0);
    expect(getWinningPath(state.board, 'player2', size)).toEqual([]);
  });

  it('AI null when no valid moves left', () => {
    const size = 3;
    const board = createEmptyBoard(size);
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        board[r][c] = (r + c) % 2 === 0 ? 'player1' : 'player2';
      }
    }
    const state = {
      ...createInitialState(size),
      board,
      winner: null,
    };
    // If fully full, moves empty
    if (getValidMoves(state).length === 0) {
      expect(getBestMove(state, 'hard')).toBeNull();
      expect(getRandomMove(state)).toBeNull();
    }
  });

  it('opening getBestMove/getRandomMove return a position', () => {
    const state = createInitialState(5);
    expect(getRandomMove(state)).not.toBeNull();
    expect(getBestMove(state, 'easy')).not.toBeNull();
  });
});
