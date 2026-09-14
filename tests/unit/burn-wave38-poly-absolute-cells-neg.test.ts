/**
 * Wave 38 — getAbsoluteCells / getCellsAtPosition / adjacency connectivity.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  TETROMINOES,
  getShapeById,
  getAbsoluteCells,
  getCellsAtPosition,
  isAdjacent,
  areCellsConnected,
  cellsToKey,
} from '../../src/core/polyomino';

describe('Wave 38 poly-absolute — negative / connectivity', () => {
  it('getAbsoluteCells agrees with getCellsAtPosition for flag-respecting path nuances', () => {
    const L = getShapeById('L', TETROMINOES)!;
    // getAbsoluteCells ignores canFlip/canRotate; getCellsAtPosition respects them
    const abs = getAbsoluteCells(L, { row: 2, col: 3 }, 90, true);
    const at = getCellsAtPosition(L, { row: 2, col: 3 }, 90, true);
    // When canFlip/canRotate true (typical), they should match
    if (L.canFlip && L.canRotate) {
      expect(cellsToKey(abs)).toBe(cellsToKey(at));
    }
    expect(abs).toHaveLength(L.cells.length);
  });

  it('negative position still returns connected cells', () => {
    const O = getShapeById('O', TETROMINOES)!;
    const cells = getAbsoluteCells(O, { row: -5, col: -3 }, 0, false);
    expect(areCellsConnected(cells)).toBe(true);
    expect(cells.every((c) => c.row <= -4)).toBe(true);
  });

  it('isAdjacent is false for diagonal-only and true for edge', () => {
    const body = [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
    ];
    expect(isAdjacent({ row: 1, col: 0 }, body)).toBe(true);
    expect(isAdjacent({ row: 1, col: 1 }, body)).toBe(true);
    expect(isAdjacent({ row: 1, col: 2 }, body)).toBe(false);
    expect(isAdjacent({ row: -1, col: -1 }, body)).toBe(false);
  });

  it('disconnected pair fails areCellsConnected', () => {
    expect(
      areCellsConnected([
        { row: 0, col: 0 },
        { row: 2, col: 2 },
      ])
    ).toBe(false);
    expect(areCellsConnected([{ row: 0, col: 0 }])).toBe(true);
    expect(areCellsConnected([])).toBe(true);
  });
});
