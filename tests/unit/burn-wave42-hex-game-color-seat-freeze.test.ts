/**
 * Wave 42 — Hex game color placement / wrong-seat stone color.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, getOpponent } from '../../src/games/hex/types';
import { makeMove } from '../../src/games/hex/rules';

describe('Wave 42 hex game — color / seat', () => {
  it('stones always match the seat that moved', () => {
    let state = createInitialState(5);
    state = makeMove(state, { row: 0, col: 1 });
    expect(state.board[0][1]).toBe('player1');
    expect(state.currentPlayer).toBe('player2');
    state = makeMove(state, { row: 1, col: 0 });
    expect(state.board[1][0]).toBe('player2');
    expect(state.currentPlayer).toBe('player1');
  });

  it('getOpponent round-trips seats', () => {
    expect(getOpponent('player1')).toBe('player2');
    expect(getOpponent('player2')).toBe('player1');
    expect(getOpponent(getOpponent('player1'))).toBe('player1');
  });

  it('win freezes currentPlayer on winner seat', () => {
    let state = createInitialState(3);
    state = {
      ...state,
      board: state.board.map((row, r) =>
        row.map((cell, c) => (c === 1 && r < 2 ? 'player1' : cell))
      ),
      currentPlayer: 'player1',
    };
    const won = makeMove(state, { row: 2, col: 1 });
    expect(won.winner).toBe('player1');
    expect(won.currentPlayer).toBe('player1');
  });
});
