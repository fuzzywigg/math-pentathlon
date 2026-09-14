/**
 * Wave 42 leftovers B — Hex game AI win/block/random leftovers (not hex-a-gone).
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  createEmptyBoard,
  type HexGameState,
} from '../../src/games/hex/types';
import { makeMove, getValidMoves, checkWinner } from '../../src/games/hex/rules';
import { getBestMove, getRandomMove } from '../../src/games/hex/ai';

function nearlyWonP1(): HexGameState {
  const size = 5;
  const board = createEmptyBoard(size);
  for (let row = 0; row < size - 1; row++) {
    board[row][1] = 'player1';
  }
  return {
    board,
    currentPlayer: 'player1',
    winner: null,
    boardSize: size,
    moveHistory: [
      { player: 'player1', position: { row: 0, col: 1 }, moveNumber: 1 },
      { player: 'player2', position: { row: 0, col: 0 }, moveNumber: 2 },
    ],
  };
}

describe('Wave 42 hex — AI win / random', () => {
  it('getBestMove finds a move that completes player1 top-bottom win', () => {
    const state = nearlyWonP1();
    expect(checkWinner(state.board, 'player1', 5)).toBe(false);
    // Completing at {4,1} wins via the filled column
    const forced = makeMove(state, { row: 4, col: 1 });
    expect(forced.winner).toBe('player1');

    const move = getBestMove(state, 'player1', 'hard');
    expect(move).not.toBeNull();
    const next = makeMove(state, move!);
    // Hard AI should prefer Infinity immediate-win when available
    expect(next.winner).toBe('player1');
  });

  it('getRandomMove null when winner set; else in valid set', () => {
    const open = createInitialState(5);
    const random = getRandomMove(open);
    expect(random).not.toBeNull();
    const valids = getValidMoves(open);
    expect(
      valids.some((m) => m.row === random!.row && m.col === random!.col)
    ).toBe(true);

    let filled = createInitialState(3);
    for (const m of getValidMoves(filled)) {
      filled = makeMove(filled, m);
      if (filled.winner) break;
    }
    if (filled.winner) {
      expect(getRandomMove(filled)).toBeNull();
      expect(getBestMove(filled, 'player1', 'easy')).toBeNull();
    }
  });

  it('opening getBestMove prefers near-center cells', () => {
    const state = createInitialState(11);
    const move = getBestMove(state, 'player1', 'medium');
    expect(move).not.toBeNull();
    const center = 5;
    expect(Math.abs(move!.row - center)).toBeLessThanOrEqual(1);
    expect(Math.abs(move!.col - center)).toBeLessThanOrEqual(1);
  });
});
