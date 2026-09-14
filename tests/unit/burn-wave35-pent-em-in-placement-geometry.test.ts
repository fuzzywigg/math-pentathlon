/**
 * Wave 35 — Pent Em In jammed placements + illegal place identity.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, BOARD_SIZE } from '../../src/games/pent-em-in/types';
import {
  getValidPlacements,
  canPlayerMove,
  placePiece,
  selectPiece,
  getPieceCells,
} from '../../src/games/pent-em-in/rules';

describe('Wave 35 Pent Em In — placement geometry', () => {
  it('opening canPlayerMove is true with free board', () => {
    const state = createInitialState();
    expect(canPlayerMove(state, 'player1')).toBe(true);
  });

  it('placePiece identity for OOB / impossible anchor', () => {
    const state = createInitialState();
    const shapeId = state.player1Pieces.available[0];
    const next = placePiece(state, shapeId, { row: -5, col: -5 }, 0, false);
    expect(next).toBe(state);
  });

  it('selectPiece then getValidPlacements nonempty for opening piece', () => {
    let state = createInitialState();
    const pieceId = state.player1Pieces.available[0];
    state = selectPiece(state, pieceId);
    expect(state.phase).toBe('placePiece');
    expect(state.selectedPiece).toBe(pieceId);
    const cells = getPieceCells(pieceId, { row: 0, col: 0 }, 0, false);
    expect(cells.length).toBeGreaterThan(0);
    const placements = getValidPlacements(state, pieceId, 0, false);
    expect(placements.length).toBeGreaterThan(0);
  });

  it('jammed board: every cell occupied → canPlayerMove false', () => {
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
  });

  it('selectPiece identity for unknown shape id', () => {
    const state = createInitialState();
    expect(selectPiece(state, 'not-a-real-piece')).toBe(state);
  });
});
