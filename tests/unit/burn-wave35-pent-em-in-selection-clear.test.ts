/**
 * Wave 35 — Pent Em In cancelSelection + AI null when jammed.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, BOARD_SIZE } from '../../src/games/pent-em-in/types';
import {
  selectPiece,
  cancelSelection,
  setPreviewPosition,
  canPlayerMove,
} from '../../src/games/pent-em-in/rules';
import { getAIMove, isAITurn } from '../../src/games/pent-em-in/ai';

describe('Wave 35 Pent Em In — selection clear', () => {
  it('cancelSelection from placePiece clears selection and preview', () => {
    let state = createInitialState();
    const id = state.player1Pieces.available[0];
    state = selectPiece(state, id);
    state = setPreviewPosition(state, { row: 2, col: 2 });
    expect(state.previewPosition).toEqual({ row: 2, col: 2 });
    const cleared = cancelSelection(state);
    expect(cleared.selectedPiece).toBeNull();
    expect(cleared.previewPosition).toBeNull();
    expect(cleared.phase).toBe('selectPiece');
  });

  it('getAIMove null when board jammed even if seat matches', () => {
    const state = createInitialState();
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
    expect(canPlayerMove(state, 'player1')).toBe(false);
    expect(getAIMove(state, 'player1', 'hard')).toBeNull();
  });

  it('isAITurn false for null AI player and gameOver', () => {
    const state = createInitialState();
    expect(isAITurn(state, null)).toBe(false);
    const over = { ...state, phase: 'gameOver' as const, winner: 'player1' as const };
    expect(isAITurn(over, 'player1')).toBe(false);
    expect(isAITurn(state, 'player1')).toBe(true);
  });
});
