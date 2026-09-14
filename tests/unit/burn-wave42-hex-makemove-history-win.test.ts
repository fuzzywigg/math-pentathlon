/**
 * Wave 42 leftovers B — Hex makeMove history / winner seat hold.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { createInitialState, createEmptyBoard } from '../../src/games/hex/types';
import { makeMove, getWinningPath } from '../../src/games/hex/rules';

describe('Wave 42 hex — makeMove history / win hold', () => {
  it('records moveHistory and holds currentPlayer on win', () => {
    let state = createInitialState(5);
    state = makeMove(state, { row: 0, col: 2 });
    expect(state.moveHistory).toHaveLength(1);
    expect(state.moveHistory[0]).toMatchObject({
      player: 'player1',
      moveNumber: 1,
      position: { row: 0, col: 2 },
    });
    expect(state.currentPlayer).toBe('player2');

    // Force vertical win for p1 on size 3
    const board = createEmptyBoard(3);
    board[0][1] = 'player1';
    board[1][1] = 'player1';
    const almost = {
      board,
      currentPlayer: 'player1' as const,
      winner: null,
      boardSize: 3,
      moveHistory: [],
    };
    const won = makeMove(almost, { row: 2, col: 1 });
    expect(won.winner).toBe('player1');
    expect(won.currentPlayer).toBe('player1');
    expect(getWinningPath(won.board, 'player1', 3).length).toBeGreaterThanOrEqual(
      3
    );
  });

  it('illegal OOB makeMove is identity', () => {
    const state = createInitialState(5);
    expect(makeMove(state, { row: -1, col: 0 })).toBe(state);
    expect(makeMove(state, { row: 5, col: 0 })).toBe(state);
  });
});
