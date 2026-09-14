/**
 * Wave 42 — Kings getBestMove vs getRandomMove on opening / trapped. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import {
  getBestMove,
  getRandomMove,
  getAIMove,
} from '../../src/games/kings-quadraphages/ai';
import {
  getValidKingMoves,
  isValidKingMove,
  isValidQuadraphagePlacement,
  findKingPosition,
} from '../../src/games/kings-quadraphages/rules';
import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';
import {
  BOARD_SIZE,
  type Board,
} from '../../src/games/kings-quadraphages/board';

afterEach(() => {
  vi.restoreAllMocks();
});

function emptyBoard(): Board {
  return Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => null)
  );
}

describe('Wave 42 kings — AI best vs random', () => {
  it('getBestMove and getRandomMove return legal king+quad pairs', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.42);
    const state = createInitialGameState();
    const best = getBestMove(state, 'player1', 'hard');
    const rand = getRandomMove(state, 'player1');
    expect(best).not.toBeNull();
    expect(rand).not.toBeNull();
    for (const move of [best!, rand!]) {
      expect(isValidKingMove(state, 'player1', move.kingMove)).toBe(true);
      // After king move, placement must be empty on simulated board conceptually:
      // at least not the destination king cell and within board
      expect(move.quadraphagePlacement).toBeDefined();
      expect(
        move.quadraphagePlacement.row !== move.kingMove.row ||
          move.quadraphagePlacement.col !== move.kingMove.col
      ).toBe(true);
    }
  });

  it('getAIMove easy matches getRandomMove shape', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1);
    const state = createInitialGameState();
    const easy = getAIMove(state, 'player1', 'easy');
    expect(easy).not.toBeNull();
    expect(getValidKingMoves(state, 'player1')).toEqual(
      expect.arrayContaining([easy!.kingMove])
    );
  });

  it('both return null when AI king is trapped', () => {
    const board = emptyBoard();
    board[0][0] = { type: 'king', owner: 'player2' };
    board[4][4] = { type: 'king', owner: 'player1' };
    board[0][1] = { type: 'quadraphage', owner: 'player1' };
    board[1][0] = { type: 'quadraphage', owner: 'player1' };
    board[1][1] = { type: 'quadraphage', owner: 'player1' };
    const state = { ...createInitialGameState(), board };
    expect(getValidKingMoves(state, 'player2')).toHaveLength(0);
    expect(getBestMove(state, 'player2')).toBeNull();
    expect(getRandomMove(state, 'player2')).toBeNull();
  });

  it('best move placement is empty after king relocates', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = createInitialGameState();
    const move = getBestMove(state, 'player1');
    expect(move).not.toBeNull();
    const king = findKingPosition(state.board, 'player1')!;
    // Simulate: vacated origin, king at dest
    const simBoard = state.board.map((row) =>
      row.map((c) => (c ? { ...c } : null))
    );
    simBoard[king.row][king.col] = null;
    simBoard[move!.kingMove.row][move!.kingMove.col] = {
      type: 'king',
      owner: 'player1',
    };
    const sim = { ...state, board: simBoard };
    expect(
      isValidQuadraphagePlacement(sim, move!.quadraphagePlacement)
    ).toBe(true);
  });
});
