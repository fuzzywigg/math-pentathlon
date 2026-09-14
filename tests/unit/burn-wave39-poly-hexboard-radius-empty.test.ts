/**
 * Wave 39 — createHexagonalBoard radius empty leftovers after #172/#173.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createHexagonalBoard,
  countEmptyCells,
  getEmptyCells,
} from '../../src/core/polyomino';

describe('Wave 39 poly — hexboard radius empty', () => {
  it('radius 0 → size 1 with one empty cell', () => {
    const b = createHexagonalBoard(0);
    expect(b.rows).toBe(1);
    expect(b.cols).toBe(1);
    expect(countEmptyCells(b)).toBe(1);
    expect(getEmptyCells(b)).toEqual([{ row: 0, col: 0 }]);
  });

  it('radius 1 blocks opposite corners; empty cells < size²', () => {
    const b = createHexagonalBoard(1);
    expect(b.rows).toBe(3);
    expect(countEmptyCells(b)).toBeLessThan(9);
    expect(countEmptyCells(b)).toBe(getEmptyCells(b).length);
    // cube-distance corners blocked: (0,0) and (2,2)
    expect(b.cells[0][0]).toBe(true);
    expect(b.cells[2][2]).toBe(true);
    // center empty
    expect(b.cells[1][1]).toBe(false);
  });

  it('radius 2 has more empty cells than radius 1', () => {
    expect(countEmptyCells(createHexagonalBoard(2))).toBeGreaterThan(
      countEmptyCells(createHexagonalBoard(1))
    );
  });
});
