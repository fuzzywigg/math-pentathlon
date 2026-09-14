/**
 * Wave 38 — centerCells / COM / bounding box empty & asymmetric edges.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  centerCells,
  getCenterOfMass,
  getBoundingBox,
  getBounds,
  normalizeCells,
} from '../../src/core/polyomino';

describe('Wave 38 poly-center — empty / asymmetric', () => {
  it('empty bbox and COM are zeros; center stays empty', () => {
    expect(getBoundingBox([])).toEqual({
      width: 0,
      height: 0,
      minRow: 0,
      minCol: 0,
    });
    expect(getBounds([])).toEqual({
      minRow: 0,
      maxRow: 0,
      minCol: 0,
      maxCol: 0,
      width: 0,
      height: 0,
    });
    expect(getCenterOfMass([])).toEqual({ row: 0, col: 0 });
    expect(centerCells([])).toEqual([]);
  });

  it('COM of asymmetric L is fractional mean', () => {
    const L = [
      { row: 0, col: 0 },
      { row: 1, col: 0 },
      { row: 2, col: 0 },
      { row: 2, col: 1 },
    ];
    const com = getCenterOfMass(L);
    expect(com.row).toBeCloseTo(5 / 4, 10);
    expect(com.col).toBeCloseTo(1 / 4, 10);
  });

  it('center then normalize keeps connected relative shape', () => {
    const cells = [
      { row: 5, col: 5 },
      { row: 5, col: 6 },
      { row: 6, col: 5 },
    ];
    const centered = centerCells(cells);
    expect(centered.some((c) => c.row < 0 || c.col < 0)).toBe(true);
    const back = normalizeCells(centered);
    expect(back).toEqual([
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 1, col: 0 },
    ]);
  });

  it('bbox width/height match getBounds for skewed set', () => {
    const cells = [
      { row: -2, col: 3 },
      { row: 1, col: 7 },
    ];
    const box = getBoundingBox(cells);
    const bounds = getBounds(cells);
    expect(box.width).toBe(bounds.width);
    expect(box.height).toBe(bounds.height);
    expect(box.minRow).toBe(bounds.minRow);
    expect(box.minCol).toBe(bounds.minCol);
  });
});
