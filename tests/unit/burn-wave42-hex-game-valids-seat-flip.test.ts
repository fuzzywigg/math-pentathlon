/**
 * Wave 42 — Hex game getValidMoves / makeMove seat flip.
 * Beyond wave41 shrink-after-place. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/hex/types';
import {
  getValidMoves,
  makeMove,
  isValidMove,
} from '../../src/games/hex/rules';

describe('Wave 42 hex game — valids and seat flip', () => {
  it('opening valids = boardSize²', () => {
    const state = createInitialState(5);
    expect(getValidMoves(state)).toHaveLength(25);
  });

  it('makeMove flips seat and shrinks valids by one', () => {
    const state = createInitialState(4);
    const before = getValidMoves(state).length;
    const next = makeMove(state, { row: 1, col: 1 });
    expect(next.currentPlayer).toBe('player2');
    expect(getValidMoves(next)).toHaveLength(before - 1);
    expect(next.moveHistory).toHaveLength(1);
    expect(next.moveHistory[0].player).toBe('player1');
  });

  it('post-win getValidMoves empty; further moves identity', () => {
    let state = createInitialState(3);
    for (let r = 0; r < 2; r++) {
      state = {
        ...state,
        board: state.board.map((row, rr) =>
          row.map((cell, c) => (c === 0 && rr === r ? 'player1' : cell))
        ),
      };
    }
    state = { ...state, currentPlayer: 'player1' };
    const won = makeMove(state, { row: 2, col: 0 });
    expect(won.winner).toBe('player1');
    expect(getValidMoves(won)).toEqual([]);
    expect(isValidMove(won, { row: 0, col: 1 })).toBe(false);
    expect(makeMove(won, { row: 0, col: 1 })).toBe(won);
  });
});
