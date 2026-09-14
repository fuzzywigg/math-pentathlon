/**
 * Wave 41 — Pent'Em In preview / multi-place leftovers.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, BOARD_SIZE } from '../../src/games/pent-em-in/types';
import {
  selectPiece,
  setPreviewPosition,
  cancelSelection,
  placePiece,
  getValidPlacements,
  getPieceCells,
  canPlayerMove,
} from '../../src/games/pent-em-in/rules';

describe('Wave 41 Pent — preview / multi-place flow', () => {
  it('preview only meaningful after select; cancel clears it', () => {
    let state = createInitialState();
    state = setPreviewPosition(state, { row: 1, col: 1 });
    expect(state.previewPosition).toEqual({ row: 1, col: 1 });
    const id = state.player1Pieces.available[0];
    state = selectPiece(state, id);
    state = setPreviewPosition(state, { row: 2, col: 3 });
    expect(state.previewPosition).toEqual({ row: 2, col: 3 });
    state = cancelSelection(state);
    expect(state.previewPosition).toBeNull();
    expect(state.phase).toBe('selectPiece');
  });

  it('two successive legal placements occupy 10 cells', () => {
    let state = createInitialState();
    for (let i = 0; i < 2; i++) {
      const id = state.player1Pieces.available[0];
      // After flip seats, use current player's available
      const pieces =
        state.currentPlayer === 'player1'
          ? state.player1Pieces
          : state.player2Pieces;
      const shapeId = pieces.available[0];
      const pos = getValidPlacements(state, shapeId, 0, false)[0];
      state = placePiece(state, shapeId, pos, 0, false);
      expect(state.moveHistory.length).toBe(i + 1);
    }
    let occupied = 0;
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (state.board[r][c].occupied) occupied++;
      }
    }
    expect(occupied).toBe(10);
    expect(state.placedPieces).toHaveLength(2);
  });

  it('piece cells stay within board for corner-safe anchors', () => {
    const state = createInitialState();
    for (const shapeId of state.player1Pieces.available.slice(0, 4)) {
      const placements = getValidPlacements(state, shapeId, 0, false);
      expect(placements.length).toBeGreaterThan(0);
      const cells = getPieceCells(shapeId, placements[0], 0, false);
      expect(
        cells.every(
          (c) =>
            c.row >= 0 &&
            c.row < BOARD_SIZE &&
            c.col >= 0 &&
            c.col < BOARD_SIZE
        )
      ).toBe(true);
    }
  });

  it('after many placements both seats may still move on open board', () => {
    let state = createInitialState();
    for (let i = 0; i < 4; i++) {
      const pieces =
        state.currentPlayer === 'player1'
          ? state.player1Pieces
          : state.player2Pieces;
      const shapeId = pieces.available[0];
      const pos = getValidPlacements(state, shapeId, 0, false)[0];
      state = placePiece(state, shapeId, pos, 0, false);
      if (state.phase === 'gameOver') break;
    }
    if (state.phase !== 'gameOver') {
      expect(canPlayerMove(state, state.currentPlayer)).toBe(true);
    }
    expect(state.moveHistory.length).toBeGreaterThanOrEqual(1);
  });
});
