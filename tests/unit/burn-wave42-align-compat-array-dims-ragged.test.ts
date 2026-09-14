/**
 * Wave 42 — getArrayDimensions ragged / empty / rectangular grids.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { getArrayDimensions, createArrayAccessor } from '../../src/core/alignment';

describe('Wave 42 align-compat — array dims ragged', () => {
  it('empty grid → 0 rows and 0 cols', () => {
    expect(getArrayDimensions([])).toEqual({ rows: 0, cols: 0 });
  });

  it('rectangular grid reports first-row width', () => {
    expect(
      getArrayDimensions([
        [1, 2, 3],
        [4, 5, 6],
      ])
    ).toEqual({ rows: 2, cols: 3 });
  });

  it('ragged rows still use first row for cols', () => {
    const grid = [[1, 2], [3], [4, 5, 6]];
    expect(getArrayDimensions(grid)).toEqual({ rows: 3, cols: 2 });
  });

  it('single empty row → cols 0', () => {
    expect(getArrayDimensions([[]])).toEqual({ rows: 1, cols: 0 });
  });

  it('accessor respects per-row length on ragged grid', () => {
    const grid = [
      ['a', 'b'],
      ['c'],
    ];
    const get = createArrayAccessor(grid);
    expect(get(0, 1)).toBe('b');
    expect(get(1, 0)).toBe('c');
    expect(get(1, 1)).toBeUndefined();
  });
});
