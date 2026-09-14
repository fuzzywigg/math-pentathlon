/**
 * Wave 41 — Pent'Em In place / trap-win / geometry leftovers.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  BOARD_SIZE,
  getPentominoShape,
} from '../../src/games/pent-em-in/types';
import {
  getPieceCells,
  canPlacePiece,
  getValidPlacements,
  canPlayerMove,
  placePiece,
  selectPiece,
} from '../../src/games/pent-em-in/rules';

describe('Wave 41 Pent — geometry / place / trap', () => {
  it('getPieceCells returns 5 cells for known pentomino; unknown → []', () => {
    const state = createInitialState();
    const id = state.player1Pieces.available[0];
    const cells = getPieceCells(id, { row: 0, col: 0 }, 0, false);
    expect(cells).toHaveLength(5);
    expect(getPieceCells('zzz', { row: 0, col: 0 }, 0, false)).toEqual([]);
  });

  it('canPlacePiece false OOB / overlap; true on empty open board', () => {
    const state = createInitialState();
    const id = state.player1Pieces.available[0];
    expect(canPlacePiece(state, id, { row: 0, col: 0 }, 0, false)).toBe(true);
    expect(canPlacePiece(state, id, { row: -1, col: 0 }, 0, false)).toBe(false);
    expect(
      canPlacePiece(state, id, { row: BOARD_SIZE, col: 0 }, 0, false)
    ).toBe(false);
    const placements = getValidPlacements(state, id, 0, false);
    expect(placements.length).toBeGreaterThan(0);
    const pos = placements[0];
    let next = placePiece(state, id, pos, 0, false);
    expect(next).not.toBe(state);
    expect(next.moveHistory).toHaveLength(1);
    // Overlap same anchor should fail after placement
    expect(canPlacePiece(next, id, pos, 0, false)).toBe(false);
  });

  it('placePiece removes shape from available and flips seat', () => {
    const state = createInitialState();
    const id = state.player1Pieces.available[0];
    const pos = getValidPlacements(state, id, 0, false)[0];
    const next = placePiece(state, id, pos, 0, false);
    expect(next.player1Pieces.available).not.toContain(id);
    expect(next.player1Pieces.placed).toContain(id);
    expect(next.currentPlayer).toBe('player2');
    expect(next.phase).toBe('selectPiece');
    expect(next.selectedPiece).toBeNull();
    expect(next.placedPieces).toHaveLength(1);
    expect(next.placedPieces[0].cells).toHaveLength(5);
  });

  it('placePiece identity for illegal placement', () => {
    const state = createInitialState();
    const id = state.player1Pieces.available[0];
    expect(placePiece(state, id, { row: -3, col: -3 }, 0, false)).toBe(state);
  });

  it('jammed board → canPlayerMove false; opening true', () => {
    const state = createInitialState();
    expect(canPlayerMove(state, 'player1')).toBe(true);
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

  it('trapping opponent ends game for placer', () => {
    // Fill entire board except leave enough for one placement that fills last free cells
    // Simpler: after place, force next player with empty available → canPlayerMove false
    const state = createInitialState();
    const id = state.player1Pieces.available[0];
    const pos = getValidPlacements(state, id, 0, false)[0];
    const trapped = {
      ...state,
      player2Pieces: { available: [], placed: [...state.player2Pieces.available] },
    };
    const next = placePiece(trapped, id, pos, 0, false);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player1');
    expect(next.currentPlayer).toBe('player1');
  });

  it('rotation/flip variants expand placement set for asymmetric piece', () => {
    const state = createInitialState();
    const asymmetric = state.player1Pieces.available.find((id) => {
      const s = getPentominoShape(id);
      return s?.canRotate && s?.canFlip;
    })!;
    const r0 = getValidPlacements(state, asymmetric, 0, false);
    const r90 = getValidPlacements(state, asymmetric, 90, false);
    const flipped = getValidPlacements(state, asymmetric, 0, true);
    expect(r0.length).toBeGreaterThan(0);
    expect(r90.length).toBeGreaterThan(0);
    expect(flipped.length).toBeGreaterThan(0);
    // select then place with rotation
    let next = selectPiece(state, asymmetric);
    expect(next.selectedPiece).toBe(asymmetric);
    next = placePiece(next, asymmetric, r90[0], 90, false);
    expect(next.moveHistory[0].rotation).toBe(90);
  });
});
