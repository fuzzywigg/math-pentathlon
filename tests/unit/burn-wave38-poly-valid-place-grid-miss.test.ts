/**
 * Wave 38 — isValidPlacement / getAllValidPositions miss leftovers.
 * Beyond wave 37 valid-positions matrix. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createGrid,
  placePolyomino,
  isValidPlacement,
  getAllValidPositions,
  isCellOccupied,
  TETROMINOES,
  getShapeById,
} from '../../src/core/polyomino';

describe('Wave 38 poly-grid — valid miss', () => {
  it('tiny grid has zero valid O positions', () => {
    const O = getShapeById('O', TETROMINOES)!;
    const grid = createGrid(1, 1);
    expect(getAllValidPositions(grid, O, 0, false)).toEqual([]);
    expect(isValidPlacement(grid, O, { row: 0, col: 0 })).toBe(false);
  });

  it('after filling origin, origin placement becomes invalid', () => {
    const O = getShapeById('O', TETROMINOES)!;
    let grid = createGrid(4, 4);
    expect(isValidPlacement(grid, O, { row: 0, col: 0 })).toBe(true);
    grid = placePolyomino(grid, O, { row: 0, col: 0 });
    expect(isValidPlacement(grid, O, { row: 0, col: 0 })).toBe(false);
    expect(isCellOccupied(grid, 0, 0)).toBe(true);
    expect(isCellOccupied(grid, -1, 0)).toBe(true);
  });

  it('valid positions shrink after a placement', () => {
    const O = getShapeById('O', TETROMINOES)!;
    let grid = createGrid(4, 4);
    const before = getAllValidPositions(grid, O, 0, false).length;
    grid = placePolyomino(grid, O, { row: 1, col: 1 });
    const after = getAllValidPositions(grid, O, 0, false).length;
    expect(after).toBeLessThan(before);
  });
});
