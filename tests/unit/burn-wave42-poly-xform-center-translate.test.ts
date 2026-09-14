/**
 * Wave 42 — centerCells / translateCells / getCenterOfMass leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  centerCells,
  translateCells,
  getCenterOfMass,
  getBoundingBox,
  normalizeCells,
  TETROMINOES,
} from '../../src/core/polyomino';

describe('Wave 42 poly-xform — center translate', () => {
  it('translate by Cell object shifts every coordinate', () => {
    const cells = [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
    ];
    expect(translateCells(cells, { row: 2, col: 3 })).toEqual([
      { row: 2, col: 3 },
      { row: 2, col: 4 },
    ]);
  });

  it('translate by numeric overload matches object form', () => {
    const cells = [{ row: 1, col: 1 }];
    expect(translateCells(cells, 4, -2)).toEqual(
      translateCells(cells, { row: 4, col: -2 })
    );
  });

  it('normalize then center keeps cell count and shrinks bbox origin', () => {
    const L = TETROMINOES.find((s) => s.id === 'L')!;
    const shifted = translateCells(L.cells, 5, 7);
    const centered = centerCells(normalizeCells(shifted));
    expect(centered).toHaveLength(L.cells.length);
    const box = getBoundingBox(centered);
    expect(box.minRow).toBeLessThanOrEqual(0);
    expect(box.minCol).toBeLessThanOrEqual(0);
  });

  it('getCenterOfMass of empty is origin', () => {
    expect(getCenterOfMass([])).toEqual({ row: 0, col: 0 });
  });

  it('getCenterOfMass of unit square is midpoint', () => {
    const cells = [
      { row: 0, col: 0 },
      { row: 0, col: 2 },
      { row: 2, col: 0 },
      { row: 2, col: 2 },
    ];
    expect(getCenterOfMass(cells)).toEqual({ row: 1, col: 1 });
  });
});
