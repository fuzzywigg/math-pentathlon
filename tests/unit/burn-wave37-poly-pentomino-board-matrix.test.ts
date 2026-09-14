/**
 * Wave 37 — PENTOMINOES board fill / valid-placement matrix.
 * Beyond wave 28 catalog symmetry. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  PENTOMINOES,
  createBoard,
  placePolyomino,
  validatePlacement,
  findValidPlacements,
  canPlaceShape,
  countEmptyCells,
  getAllOrientations,
  getAbsoluteCells,
  areCellsInBounds,
  cellsToKey,
  type Rotation,
} from '../../src/core/polyomino';

describe('Wave 37 poly-pentomino — placeability on 5×5 / 6×6', () => {
  it('every pentomino can place somewhere on a 6×6 board', () => {
    const board = createBoard(6, 6);
    for (const shape of PENTOMINOES) {
      expect(canPlaceShape(board, shape)).toBe(true);
      const positions = findValidPlacements(board, shape);
      expect(positions.length).toBeGreaterThan(0);
    }
  });

  it('X pentomino fits at origin on 5×5 but not near far corner', () => {
    const X = PENTOMINOES.find((s) => s.id === 'X')!;
    const board = createBoard(5, 5);
    expect(validatePlacement(board, X, { row: 0, col: 0 }).valid).toBe(true);
    expect(validatePlacement(board, X, { row: 3, col: 3 }).valid).toBe(false);
    const placed = placePolyomino(board, X, { row: 1, col: 1 });
    expect(countEmptyCells(placed)).toBe(20);
  });

  it('I5 pentomino fits short-wide board flat; needs tall board when rotated', () => {
    const I = PENTOMINOES.find((s) => s.id === 'I5')!;
    expect(
      validatePlacement(createBoard(2, 5), I, { row: 0, col: 0 }, 0).valid
    ).toBe(true);
    expect(
      validatePlacement(createBoard(2, 5), I, { row: 0, col: 0 }, 90).valid
    ).toBe(false);
    expect(
      validatePlacement(createBoard(5, 2), I, { row: 0, col: 0 }, 90).valid
    ).toBe(true);
  });

  it('placing two non-overlapping pentominoes reduces empty by 10', () => {
    const F = PENTOMINOES.find((s) => s.id === 'F')!;
    const U = PENTOMINOES.find((s) => s.id === 'U')!;
    let board = createBoard(8, 8);
    board = placePolyomino(board, F, { row: 0, col: 0 });
    // find a U placement that does not overlap
    const spots = findValidPlacements(board, U);
    expect(spots.length).toBeGreaterThan(0);
    board = placePolyomino(board, U, spots[0]);
    expect(countEmptyCells(board)).toBe(64 - 10);
    expect(board.placements).toHaveLength(2);
  });
});

describe('Wave 37 poly-pentomino — orientation bounds matrix', () => {
  it('every orientation of every pentomino fits in a 5×5 after normalize placement', () => {
    for (const shape of PENTOMINOES) {
      const orients = getAllOrientations(shape);
      expect(orients.length).toBeGreaterThan(0);
      for (const cells of orients) {
        expect(areCellsInBounds(cells, 5, 5)).toBe(true);
        expect(cells).toHaveLength(5);
      }
    }
  });

  it('absolute cells at position stay in-bounds for valid placements', () => {
    const board = createBoard(6, 6);
    for (const shape of PENTOMINOES.slice(0, 6)) {
      const rotations: Rotation[] = shape.canRotate ? [0, 90, 180, 270] : [0];
      for (const rot of rotations) {
        const spots = findValidPlacements(board, shape, rot, false);
        for (const pos of spots.slice(0, 3)) {
          const cells = getAbsoluteCells(shape, pos, rot, false);
          expect(areCellsInBounds(cells, 6, 6)).toBe(true);
          expect(cellsToKey(cells).split('|')).toHaveLength(5);
        }
      }
    }
  });
});
