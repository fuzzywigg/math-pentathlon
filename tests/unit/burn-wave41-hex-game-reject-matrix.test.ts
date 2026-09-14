/**
 * Wave 41 — Hex game (not hex-a-gone) move reject + neighbor bounds.
 * Tests-only. Avoids hex-a-gone claimed by #181.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/hex/types';
import {
  isValidMove,
  isValidPosition,
  getNeighbors,
  makeMove,
  getValidMoves,
  checkWinner,
} from '../../src/games/hex/rules';

describe('Wave 41 hex game — reject matrix', () => {
  it('isValidPosition OOB false; corner neighbors fewer than 6', () => {
    const state = createInitialState();
    expect(isValidPosition({ row: -1, col: 0 }, state.boardSize)).toBe(false);
    expect(isValidPosition({ row: 0, col: 0 }, state.boardSize)).toBe(true);
    expect(getNeighbors({ row: 0, col: 0 }, state.boardSize).length).toBeLessThan(6);
  });

  it('isValidMove false on occupied / gameOver / OOB', () => {
    let state = createInitialState();
    state = makeMove(state, { row: 0, col: 0 });
    expect(isValidMove(state, { row: 0, col: 0 })).toBe(false);
    expect(isValidMove(state, { row: -1, col: 0 })).toBe(false);
    const over = { ...state, winner: 'player1' as const };
    expect(isValidMove(over, { row: 1, col: 1 })).toBe(false);
  });

  it('getValidMoves shrinks after place; opening empty winner false', () => {
    const state = createInitialState();
    const opening = getValidMoves(state).length;
    const next = makeMove(state, { row: 2, col: 2 });
    expect(getValidMoves(next).length).toBe(opening - 1);
    expect(checkWinner(state.board, 'player1', state.boardSize)).toBe(false);
  });
});
