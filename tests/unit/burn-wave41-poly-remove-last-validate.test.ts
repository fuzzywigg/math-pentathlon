/**
 * Wave 41 — Polyomino removeLast identity + validatePlacement reasons + OOB occupied.
 * Avoids poly-ui (#180) and PR182 rotation/connected claims. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createBoard,
  createGrid,
  removeLastPolyomino,
  validatePlacement,
  isCellOccupied,
  placePolyomino,
  doPlacementsOverlap,
  getShapeById,
  getSymmetryCount,
  SIMPLE_SHAPES,
  PENTOMINOES,
  type Placement,
} from '../../src/core/polyomino';

describe('Wave 41 poly — removeLast / validate / OOB', () => {
  it('removeLastPolyomino empty board identity', () => {
    const board = createBoard(4, 4);
    expect(removeLastPolyomino(board, SIMPLE_SHAPES)).toBe(board);
  });

  it('validatePlacement OOB and occupied reasons', () => {
    const board = createBoard(3, 3);
    const mono = getShapeById('monomino', SIMPLE_SHAPES)!;
    expect(mono).toBeTruthy();
    const oob = validatePlacement(board, mono, { row: 10, col: 10 }, 0, false);
    expect(oob.valid).toBe(false);
    expect(oob.reason ?? '').toMatch(/beyond|bound/i);

    const placed = placePolyomino(board, mono, { row: 0, col: 0 }, 0, false);
    const occ = validatePlacement(placed, mono, { row: 0, col: 0 }, 0, false);
    expect(occ.valid).toBe(false);
    expect(occ.reason ?? '').toMatch(/occup/i);
  });

  it('Grid isCellOccupied treats OOB as occupied', () => {
    const grid = createGrid(2, 2);
    expect(isCellOccupied(grid, -1, 0)).toBe(true);
    expect(isCellOccupied(grid, 0, 0)).toBe(false);
  });

  it('doPlacementsOverlap non-overlapping monos false', () => {
    const mono = getShapeById('monomino', SIMPLE_SHAPES)!;
    const a: Placement = {
      polyomino: mono,
      position: { row: 0, col: 0 },
      rotation: 0,
      flipped: false,
    };
    const b: Placement = {
      polyomino: mono,
      position: { row: 2, col: 2 },
      rotation: 0,
      flipped: false,
    };
    expect(doPlacementsOverlap(a, b)).toBe(false);
  });

  it('getShapeById miss undefined; X symmetry high', () => {
    expect(getShapeById('nope-shape', PENTOMINOES)).toBeUndefined();
    const x = getShapeById('X', PENTOMINOES);
    expect(x).toBeTruthy();
    expect(getSymmetryCount(x!)).toBeGreaterThanOrEqual(1);
  });
});
