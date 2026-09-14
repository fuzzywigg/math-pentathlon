/**
 * Wave 42 — Hex game AI getRandomMove / getBestMove leftovers.
 * Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState, createEmptyBoard } from '../../src/games/hex/types';
import { getValidMoves, makeMove } from '../../src/games/hex/rules';
import { getBestMove, getRandomMove } from '../../src/games/hex/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 42 hex game — AI leftovers', () => {
  it('getRandomMove returns a listed valid on seeded board', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = createInitialState(5);
    const move = getRandomMove(state);
    expect(move).not.toBeNull();
    expect(
      getValidMoves(state).some((m) => m.row === move!.row && m.col === move!.col)
    ).toBe(true);
  });

  it('getBestMove easy opening prefers near-center', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.2);
    const state = createInitialState(7);
    const move = getBestMove(state, 'player1', 'easy');
    expect(move).not.toBeNull();
    const center = Math.floor(state.boardSize / 2);
    expect(Math.abs(move!.row - center)).toBeLessThanOrEqual(1);
    expect(Math.abs(move!.col - center)).toBeLessThanOrEqual(1);
  });

  it('full board → both AI helpers null', () => {
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
      moveHistory: [{ player: 'player1' as const, position: { row: 0, col: 0 }, moveNumber: 1 }],
    };
    expect(getValidMoves(state)).toEqual([]);
    expect(getRandomMove(state)).toBeNull();
    expect(getBestMove(state, 'player1', 'easy')).toBeNull();
    void makeMove;
  });
});
