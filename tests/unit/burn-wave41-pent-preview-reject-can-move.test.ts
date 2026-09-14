/**
 * Wave 41 — Pent-Em-In setPreviewPosition / placePiece rejects / canPlayerMove.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, BOARD_SIZE } from '../../src/games/pent-em-in/types';
import {
  setPreviewPosition,
  placePiece,
  canPlayerMove,
  selectPiece,
} from '../../src/games/pent-em-in/rules';

describe('Wave 41 Pent-Em-In — preview / reject / canPlayerMove', () => {
  it('setPreviewPosition sets and clears preview cell', () => {
    const state = selectPiece(createInitialState(), 'X');
    const withPreview = setPreviewPosition(state, { row: 4, col: 4 });
    expect(withPreview.previewPosition).toEqual({ row: 4, col: 4 });
    const cleared = setPreviewPosition(withPreview, null);
    expect(cleared.previewPosition).toBeNull();
  });

  it('placePiece rejects OOB and overlap (identity)', () => {
    const state = createInitialState();
    const oob = placePiece(state, 'X', { row: -3, col: 0 }, 0, false);
    expect(oob).toBe(state);

    let placed = placePiece(state, 'X', { row: 2, col: 2 }, 0, false);
    placed = { ...placed, currentPlayer: 'player1', phase: 'selectPiece' };
    const overlap = placePiece(placed, 'U', { row: 2, col: 2 }, 0, false);
    expect(overlap).toBe(placed);
  });

  it('canPlayerMove true on empty; false when board jammed', () => {
    const open = createInitialState();
    expect(canPlayerMove(open, 'player1')).toBe(true);
    expect(canPlayerMove(open, 'player2')).toBe(true);

    const jammed = createInitialState();
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        jammed.board[r][c] = {
          row: r,
          col: c,
          occupied: true,
          owner: 'player1',
          pieceId: 'block',
        };
      }
    }
    expect(canPlayerMove(jammed, 'player1')).toBe(false);
    expect(canPlayerMove(jammed, 'player2')).toBe(false);
  });
});
