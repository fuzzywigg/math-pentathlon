/**
 * Wave 45 — Pent placePiece trap-win when opponent cannot move leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, BOARD_SIZE } from '../../src/games/pent-em-in/types';
import { placePiece } from '../../src/games/pent-em-in/rules';

describe('Wave 45 pent — trap win forge', () => {
  it('nearly full board with monomino-like leftover can trap', () => {
    const state = createInitialState();
    // Fill all but a tiny region that cannot fit any pentomino for p2
    const board = state.board.map((row) => row.map((c) => ({ ...c })));
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (!(r === 0 && c < 5)) {
          board[r][c] = { ...board[r][c], occupied: true, owner: 'player2', pieceId: 'fill' };
        }
      }
    }
    const forged = {
      ...state,
      board,
      player1Pieces: { available: ['I5'], placed: [] },
      player2Pieces: { available: ['X'], placed: [] },
    };
    const next = placePiece(forged, 'I5', { row: 0, col: 0 }, 0, false);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player1');
  });
});
