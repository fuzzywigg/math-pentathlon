/**
 * Wave 42 — getSymmetryCount / getBounds / areCellsInBounds leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  getSymmetryCount,
  getBounds,
  getBoundingBox,
  areCellsInBounds,
  getAllTransformations,
  getPolyominoById,
  TETROMINOES,
} from '../../src/core/polyomino';

describe('Wave 42 poly-xform — symmetry bounds', () => {
  it('O symmetry count is 1', () => {
    expect(getSymmetryCount(getPolyominoById('O')!)).toBe(1);
  });

  it('getSymmetryCount equals getAllTransformations length', () => {
    for (const id of ['I', 'T', 'L', 'S']) {
      const s = getPolyominoById(id)!;
      expect(getSymmetryCount(s)).toBe(getAllTransformations(s).length);
    }
  });

  it('getBounds empty returns zeros', () => {
    expect(getBounds([])).toEqual({
      minRow: 0,
      maxRow: 0,
      minCol: 0,
      maxCol: 0,
      width: 0,
      height: 0,
    });
  });

  it('getBounds matches getBoundingBox width/height', () => {
    const T = TETROMINOES.find((s) => s.id === 'T')!;
    const b = getBounds(T.cells);
    const box = getBoundingBox(T.cells);
    expect(b.width).toBe(box.width);
    expect(b.height).toBe(box.height);
  });

  it('areCellsInBounds rejects OOB and accepts in-range', () => {
    expect(areCellsInBounds([{ row: 0, col: 0 }], 2, 2)).toBe(true);
    expect(areCellsInBounds([{ row: 2, col: 0 }], 2, 2)).toBe(false);
    expect(areCellsInBounds([{ row: -1, col: 0 }], 2, 2)).toBe(false);
  });
});
