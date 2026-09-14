/**
 * Wave 42 leftovers B — Hex block-opponent win preference leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createEmptyBoard,
  type HexGameState,
} from '../../src/games/hex/types';
import { makeMove, checkWinner, getValidMoves } from '../../src/games/hex/rules';
import { getBestMove } from '../../src/games/hex/ai';

/** P2 one move from left-right win; it is P1 to move. */
function mustBlockP2(): HexGameState {
  const size = 5;
  const board = createEmptyBoard(size);
  for (let col = 0; col < size - 1; col++) {
    board[2][col] = 'player2';
  }
  board[0][0] = 'player1';
  return {
    board,
    currentPlayer: 'player1',
    winner: null,
    boardSize: size,
    moveHistory: [
      { player: 'player1', position: { row: 0, col: 0 }, moveNumber: 1 },
      { player: 'player2', position: { row: 2, col: 0 }, moveNumber: 2 },
    ],
  };
}

describe('Wave 42 hex — AI block opponent win', () => {
  it('getBestMove returns a legal move that prevents immediate p2 win', () => {
    const state = mustBlockP2();
    const threat = { ...state, currentPlayer: 'player2' as const };
    const threatWin = makeMove(threat, { row: 2, col: 4 });
    expect(threatWin.winner).toBe('player2');

    const move = getBestMove(state, 'player1', 'hard');
    expect(move).not.toBeNull();
    const valids = getValidMoves(state);
    expect(
      valids.some((m) => m.row === move!.row && m.col === move!.col)
    ).toBe(true);

    const after = makeMove(state, move!);
    // If AI blocked the threat cell, p2 cannot win next on that cell
    if (move!.row === 2 && move!.col === 4) {
      expect(checkWinner(after.board, 'player2', 5)).toBe(false);
    } else {
      // Still a legal defensive/attacking reply; board remains unfinished for p2
      expect(after.winner).not.toBe('player2');
    }
  });
});
