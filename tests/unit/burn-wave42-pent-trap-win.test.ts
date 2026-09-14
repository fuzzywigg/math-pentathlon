/**
 * Wave 42 — Pent'Em In trap-win when opponent cannot move leftovers after #186.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, BOARD_SIZE } from '../../src/games/pent-em-in/types';
import { placePiece, canPlayerMove } from '../../src/games/pent-em-in/rules';

function leaveHorizontalRun(
  state: ReturnType<typeof createInitialState>,
  row: number,
  startCol: number,
  length: number
) {
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const inRun =
        r === row && c >= startCol && c < startCol + length;
      state.board[r][c] = {
        row: r,
        col: c,
        occupied: !inRun,
        owner: inRun ? null : 'player2',
        pieceId: inRun ? null : 'wall',
      };
    }
  }
}

describe('Wave 42 pent-em-in — trap-win detection', () => {
  it('filling last 5-cell row traps opponent → player1 wins', () => {
    let state = createInitialState();
    leaveHorizontalRun(state, 0, 0, 5);
    state = { ...state, currentPlayer: 'player1', phase: 'selectPiece' };

    expect(canPlayerMove(state, 'player2')).toBe(true);
    const next = placePiece(state, 'I5', { row: 0, col: 0 }, 0, false);
    expect(next.winner).toBe('player1');
    expect(next.phase).toBe('gameOver');
    expect(next.currentPlayer).toBe('player1');
    expect(canPlayerMove(next, 'player2')).toBe(false);
  });

  it('non-trapping move keeps play going', () => {
    const state = createInitialState();
    const next = placePiece(state, 'X', { row: 4, col: 4 }, 0, false);
    expect(next.winner).toBeNull();
    expect(next.phase).toBe('selectPiece');
    expect(next.currentPlayer).toBe('player2');
  });
});
