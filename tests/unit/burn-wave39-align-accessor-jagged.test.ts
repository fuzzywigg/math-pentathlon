/**
 * Wave 39 — createArrayAccessor vs createArrayGetter jagged/OOB leftovers.
 * Alignment skipped by waves 35–38. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createArrayAccessor,
  getArrayDimensions,
} from '../../src/core/alignment';
import { createArrayGetter } from '../../src/core/alignment/grid-alignment';

describe('Wave 39 align — accessor jagged / empty', () => {
  it('empty grid reports 0×0 dimensions', () => {
    expect(getArrayDimensions([])).toEqual({ rows: 0, cols: 0 });
  });

  it('createArrayAccessor returns undefined OOB; createArrayGetter returns null', () => {
    const grid = [
      ['X', 'O'],
      ['O'],
    ];
    const acc = createArrayAccessor(grid);
    const get = createArrayGetter(grid);

    expect(acc(0, 0)).toBe('X');
    expect(get(0, 0)).toBe('X');

    expect(acc(-1, 0)).toBeUndefined();
    expect(get(-1, 0)).toBeNull();

    expect(acc(0, 5)).toBeUndefined();
    expect(get(0, 5)).toBeNull();

    // jagged: row 1 only has col 0
    expect(acc(1, 1)).toBeUndefined();
    expect(get(1, 1)).toBeNull();
  });

  it('accessor preserves in-row short cells without inventing values', () => {
    const grid = [['A'], ['B', 'C', 'D']];
    const acc = createArrayAccessor(grid);
    expect(acc(0, 0)).toBe('A');
    expect(acc(0, 1)).toBeUndefined();
    expect(acc(1, 2)).toBe('D');
    expect(getArrayDimensions(grid)).toEqual({ rows: 2, cols: 1 });
  });
});
