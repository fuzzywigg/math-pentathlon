/**
 * Wave 37 — HEX_PATTERN_BLOCKS placement / transform board edges.
 * Catalog was smoke-covered in wave 28; placement depth is thin. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  HEX_PATTERN_BLOCKS,
  createBoard,
  placePolyomino,
  validatePlacement,
  findValidPlacements,
  canPlaceShape,
  getEmptyCells,
  countEmptyCells,
  getTransformedCells,
  getAllOrientations,
  areCellsConnected,
  cellsToKey,
  type Rotation,
} from '../../src/core/polyomino';

const byId = (id: string) => HEX_PATTERN_BLOCKS.find((s) => s.id === id)!;

describe('Wave 37 poly-hex-pattern — catalog placement on boards', () => {
  it('every hex pattern block places at origin on a large board', () => {
    for (const shape of HEX_PATTERN_BLOCKS) {
      const board = createBoard(6, 6);
      const result = validatePlacement(board, shape, { row: 0, col: 0 });
      expect(result.valid).toBe(true);
      const placed = placePolyomino(board, shape, { row: 0, col: 0 });
      expect(placed.placements).toHaveLength(1);
      expect(countEmptyCells(placed)).toBe(36 - shape.cells.length);
    }
  });

  it('trapezoid horizontal fits 1×3; rotated may need taller board', () => {
    const trap = byId('trapezoid');
    expect(
      validatePlacement(createBoard(1, 3), trap, { row: 0, col: 0 }, 0).valid
    ).toBe(true);
    expect(
      findValidPlacements(createBoard(1, 3), trap, 0, false).length
    ).toBeGreaterThan(0);
  });

  it('rhombus and square (2-cell) fill a 1×2 board exactly once each', () => {
    for (const id of ['rhombus', 'square'] as const) {
      const shape = byId(id);
      const board = createBoard(1, 2);
      // square is vertical by default — may need rotation
      const rotations: Rotation[] = [0, 90, 180, 270];
      const any = rotations.some(
        (r) => validatePlacement(board, shape, { row: 0, col: 0 }, r).valid
      );
      expect(any).toBe(true);
      expect(canPlaceShape(board, shape)).toBe(true);
    }
  });

  it('monomer hexagon/triangle occupy single cells and leave the rest empty', () => {
    for (const id of ['hexagon', 'triangle'] as const) {
      let board = createBoard(2, 2);
      board = placePolyomino(board, byId(id), { row: 1, col: 1 });
      expect(getEmptyCells(board)).toHaveLength(3);
      expect(board.cells[1][1]).toBe(true);
    }
  });
});

describe('Wave 37 poly-hex-pattern — orientations / connectivity', () => {
  it('all hex pattern cell sets are connected', () => {
    for (const shape of HEX_PATTERN_BLOCKS) {
      expect(areCellsConnected(shape.cells)).toBe(true);
    }
  });

  it('orientation keys are stable under identity transform', () => {
    for (const shape of HEX_PATTERN_BLOCKS) {
      const keys = getAllOrientations(shape).map(cellsToKey);
      expect(new Set(keys).size).toBe(keys.length); // unique orientations
      expect(cellsToKey(getTransformedCells(shape, 0, false))).toBe(
        cellsToKey(shape.cells)
      );
    }
  });

  it('canFlip=false shapes ignore flip for placement validity on open board', () => {
    const rhombus = byId('rhombus');
    expect(rhombus.canFlip).toBe(false);
    const board = createBoard(4, 4);
    const plain = findValidPlacements(board, rhombus, 0, false);
    const flipped = findValidPlacements(board, rhombus, 0, true);
    // flipped transform still yields valid geometry even if flag says canFlip false
    expect(plain.length).toBeGreaterThan(0);
    expect(flipped.length).toBeGreaterThan(0);
  });
});
