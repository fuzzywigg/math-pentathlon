/**
 * Wave 42 — Pent'Em In canPlayerMove opening vs jammed-with-pieces-left leftovers after #186.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  BOARD_SIZE,
  PIECES_PER_PLAYER,
} from '../../src/games/pent-em-in/types';
import { canPlayerMove } from '../../src/games/pent-em-in/rules';

function jamEntireBoard(state: ReturnType<typeof createInitialState>) {
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      state.board[r][c] = {
        row: r,
        col: c,
        occupied: true,
        owner: 'player2',
        pieceId: 'jam',
      };
    }
  }
}

describe('Wave 42 pent-em-in — canPlayerMove opening vs jammed', () => {
  it('both players can move on empty opening board', () => {
    const state = createInitialState();
    expect(canPlayerMove(state, 'player1')).toBe(true);
    expect(canPlayerMove(state, 'player2')).toBe(true);
  });

  it('fully jammed board: false even when player still has all 12 pieces', () => {
    const state = createInitialState();
    jamEntireBoard(state);
    expect(state.player1Pieces.available).toHaveLength(PIECES_PER_PLAYER);
    expect(state.player2Pieces.available).toHaveLength(PIECES_PER_PLAYER);
    expect(canPlayerMove(state, 'player1')).toBe(false);
    expect(canPlayerMove(state, 'player2')).toBe(false);
  });

  it('partial jam with isolated holes still false when no pentomino fits', () => {
    const state = createInitialState();
    jamEntireBoard(state);
    state.board[0][0].occupied = false;
    state.board[9][9].occupied = false;
    expect(state.player1Pieces.available.length).toBeGreaterThan(0);
    expect(canPlayerMove(state, 'player1')).toBe(false);
  });
});
