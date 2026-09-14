/**
 * Wave 38 — isInBounds / isOccupied / areCellsInBounds OOB matrix.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createBoard,
  isInBounds,
  isOccupied,
  areCellsInBounds,
  placePolyomino,
  TETROMINOES,
  getShapeById,
} from '../../src/core/polyomino';

describe('Wave 38 poly-inbounds — OOB matrix', () => {
  it('OOB cells are out of bounds and count as occupied', () => {
    const board = createBoard(3, 3);
    const oob = [
      { row: -1, col: 0 },
      { row: 0, col: -1 },
      { row: 3, col: 0 },
      { row: 0, col: 3 },
      { row: 99, col: 99 },
    ];
    for (const cell of oob) {
      expect(isInBounds(board, cell)).toBe(false);
      expect(isOccupied(board, cell)).toBe(true);
    }
  });

  it('empty interior cells are in bounds and free', () => {
    const board = createBoard(2, 2);
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 2; c++) {
        expect(isInBounds(board, { row: r, col: c })).toBe(true);
        expect(isOccupied(board, { row: r, col: c })).toBe(false);
      }
    }
  });

  it('areCellsInBounds empty is vacuously true; OOB set fails', () => {
    expect(areCellsInBounds([], 5, 5)).toBe(true);
    expect(
      areCellsInBounds(
        [
          { row: 0, col: 0 },
          { row: 5, col: 0 },
        ],
        5,
        5
      )
    ).toBe(false);
  });

  it('placed O cells become occupied but stay in bounds', () => {
    const O = getShapeById('O', TETROMINOES)!;
    let board = createBoard(5, 5);
    board = placePolyomino(board, O, { row: 1, col: 1 });
    for (const cell of [
      { row: 1, col: 1 },
      { row: 1, col: 2 },
      { row: 2, col: 1 },
      { row: 2, col: 2 },
    ]) {
      expect(isInBounds(board, cell)).toBe(true);
      expect(isOccupied(board, cell)).toBe(true);
    }
  });
});
