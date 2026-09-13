import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/hex/types';
import { makeMove, getValidMoves } from '../../src/games/hex/rules';
import { getBestMove, getRandomMove } from '../../src/games/hex/ai';
import { formatPosition } from '../../src/games/hex/board-ui';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Hex AI', () => {
  it('getRandomMove returns an empty in-bounds cell on a fresh board', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = createInitialState(5);
    const move = getRandomMove(state);
    expect(move).not.toBeNull();
    expect(getValidMoves(state)).toEqual(
      expect.arrayContaining([expect.objectContaining(move!)])
    );
    expect(state.board[move!.row][move!.col]).toBeNull();
  });

  it('getRandomMove returns null when the board is full', () => {
    let state = createInitialState(2);
    // Fill all 4 cells
    for (const pos of getValidMoves(state)) {
      state = makeMove(state, pos);
    }
    // After 4 placements board is full; last makeMove may have set a winner
    const full = {
      ...state,
      winner: null,
      board: [
        ['player1', 'player2'],
        ['player2', 'player1'],
      ] as (typeof state.board),
      currentPlayer: 'player1' as const,
    };
    expect(getValidMoves(full)).toHaveLength(0);
    expect(getRandomMove(full)).toBeNull();
    expect(getBestMove(full, 'player1', 'easy')).toBeNull();
  });

  it('getBestMove opening prefers a near-center cell', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = createInitialState(11);
    const move = getBestMove(state, 'player1', 'easy');
    expect(move).not.toBeNull();
    const center = Math.floor(state.boardSize / 2);
    expect(Math.abs(move!.row - center)).toBeLessThanOrEqual(1);
    expect(Math.abs(move!.col - center)).toBeLessThanOrEqual(1);
  });

  it('getBestMove easy returns a legal empty cell midgame', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    let state = createInitialState(5);
    state = makeMove(state, { row: 2, col: 2 });
    state = makeMove(state, { row: 0, col: 0 });
    const move = getBestMove(state, 'player1', 'easy');
    expect(move).not.toBeNull();
    expect(state.board[move!.row][move!.col]).toBeNull();
    expect(getValidMoves(state)).toEqual(
      expect.arrayContaining([expect.objectContaining(move!)])
    );
  });

  it('getBestMove medium returns a legal cell after two opening stones', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    let state = createInitialState(5);
    state = makeMove(state, { row: 2, col: 2 });
    state = makeMove(state, { row: 1, col: 1 });
    // moveHistory length >= 2 exits the opening center shortcut
    expect(state.moveHistory.length).toBeGreaterThanOrEqual(2);
    const move = getBestMove(state, 'player1', 'medium');
    expect(move).not.toBeNull();
    expect(getValidMoves(state).some((m) => m.row === move!.row && m.col === move!.col)).toBe(
      true
    );
  });
});

describe('Hex board-ui helpers', () => {
  it('formatPosition maps col/row to algebraic labels', () => {
    expect(formatPosition({ row: 0, col: 0 })).toBe('A1');
    expect(formatPosition({ row: 10, col: 10 })).toBe('K11');
    expect(formatPosition({ row: 4, col: 2 })).toBe('C5');
  });
});
