/**
 * Wave 41 — Pent-Em-In getPieceCells + canPlacePiece bounds/overlap.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, BOARD_SIZE } from '../../src/games/pent-em-in/types';
import {
  getPieceCells,
  canPlacePiece,
  placePiece,
} from '../../src/games/pent-em-in/rules';

describe('Wave 41 Pent-Em-In — getPieceCells / canPlacePiece', () => {
  it('unknown shape returns empty cells', () => {
    expect(getPieceCells('not-real', { row: 0, col: 0 }, 0, false)).toEqual(
      []
    );
  });

  it('X pentomino yields five translated cells', () => {
    const cells = getPieceCells('X', { row: 1, col: 1 }, 0, false);
    expect(cells).toHaveLength(5);
    for (const cell of cells) {
      expect(cell.row).toBeGreaterThanOrEqual(1);
      expect(cell.col).toBeGreaterThanOrEqual(1);
    }
  });

  it('canPlacePiece true on empty board center; false OOB', () => {
    const state = createInitialState();
    expect(canPlacePiece(state, 'X', { row: 2, col: 2 }, 0, false)).toBe(true);
    expect(canPlacePiece(state, 'X', { row: BOARD_SIZE - 1, col: BOARD_SIZE - 1 }, 0, false)).toBe(
      false
    );
    expect(canPlacePiece(state, 'X', { row: -1, col: 0 }, 0, false)).toBe(
      false
    );
  });

  it('canPlacePiece false after overlapping an existing X', () => {
    let state = createInitialState();
    state = placePiece(state, 'X', { row: 2, col: 2 }, 0, false);
    state = { ...state, currentPlayer: 'player1', phase: 'selectPiece' };
    expect(canPlacePiece(state, 'V', { row: 2, col: 2 }, 0, false)).toBe(
      false
    );
  });
});
