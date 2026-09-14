/**
 * Wave 24 — grid-alignment bounds / wrap / array getter.
 * Distinct from alignment.test.ts compat wrappers (object signatures) and
 * wave 21 contiguous regions / wave 22 highlight-ui. Imports raw
 * grid-alignment APIs directly. Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  isInBounds,
  wrapPosition,
  createArrayGetter,
} from '../../src/core/alignment/grid-alignment';
import type { CellValue } from '../../src/core/alignment/types';

describe('Wave 24 grid-bounds — isInBounds corners and OOB', () => {
  it('accepts corners and interior; rejects negatives and size edges', () => {
    expect(isInBounds(0, 0, 5, 5)).toBe(true);
    expect(isInBounds(4, 4, 5, 5)).toBe(true);
    expect(isInBounds(2, 3, 5, 5)).toBe(true);

    expect(isInBounds(-1, 0, 5, 5)).toBe(false);
    expect(isInBounds(0, -1, 5, 5)).toBe(false);
    expect(isInBounds(5, 0, 5, 5)).toBe(false);
    expect(isInBounds(0, 5, 5, 5)).toBe(false);
    expect(isInBounds(5, 5, 5, 5)).toBe(false);
  });

  it('handles 1×1 and 0×0 grids', () => {
    expect(isInBounds(0, 0, 1, 1)).toBe(true);
    expect(isInBounds(0, 1, 1, 1)).toBe(false);
    expect(isInBounds(1, 0, 1, 1)).toBe(false);

    expect(isInBounds(0, 0, 0, 0)).toBe(false);
    expect(isInBounds(-1, -1, 0, 0)).toBe(false);
  });

  it('supports non-square dimensions', () => {
    expect(isInBounds(2, 6, 3, 7)).toBe(true);
    expect(isInBounds(2, 7, 3, 7)).toBe(false);
    expect(isInBounds(3, 0, 3, 7)).toBe(false);
  });
});

describe('Wave 24 grid-bounds — wrapPosition toroidal mods', () => {
  it('leaves in-bounds positions unchanged', () => {
    expect(wrapPosition(2, 3, 5, 5)).toEqual({ row: 2, col: 3 });
    expect(wrapPosition(0, 0, 4, 6)).toEqual({ row: 0, col: 0 });
  });

  it('wraps negatives into positive range', () => {
    expect(wrapPosition(-1, 0, 5, 5)).toEqual({ row: 4, col: 0 });
    expect(wrapPosition(0, -1, 5, 5)).toEqual({ row: 0, col: 4 });
    expect(wrapPosition(-1, -1, 5, 5)).toEqual({ row: 4, col: 4 });
    expect(wrapPosition(-6, 2, 5, 5)).toEqual({ row: 4, col: 2 });
  });

  it('wraps oversized positives', () => {
    expect(wrapPosition(5, 0, 5, 5)).toEqual({ row: 0, col: 0 });
    expect(wrapPosition(0, 5, 5, 5)).toEqual({ row: 0, col: 0 });
    expect(wrapPosition(7, 8, 5, 5)).toEqual({ row: 2, col: 3 });
    expect(wrapPosition(10, 10, 5, 5)).toEqual({ row: 0, col: 0 });
  });

  it('wraps rectangular boards independently per axis', () => {
    expect(wrapPosition(3, -1, 3, 4)).toEqual({ row: 0, col: 3 });
    expect(wrapPosition(-1, 4, 3, 4)).toEqual({ row: 2, col: 0 });
  });
});

describe('Wave 24 grid-bounds — createArrayGetter', () => {
  it('returns cell values for in-bounds coords', () => {
    const board: CellValue[][] = [
      ['X', 'O', null],
      [null, 'X', 'O'],
    ];
    const get = createArrayGetter(board);
    expect(get(0, 0)).toBe('X');
    expect(get(0, 2)).toBeNull();
    expect(get(1, 1)).toBe('X');
    expect(get(1, 2)).toBe('O');
  });

  it('returns null for OOB including negative indices', () => {
    const board: CellValue[][] = [
      [1, 2],
      [3, 4],
    ];
    const get = createArrayGetter(board);
    expect(get(-1, 0)).toBeNull();
    expect(get(0, -1)).toBeNull();
    expect(get(2, 0)).toBeNull();
    expect(get(0, 2)).toBeNull();
    expect(get(99, 99)).toBeNull();
  });

  it('respects jagged row lengths', () => {
    const jagged: CellValue[][] = [['A'], ['B', 'C', 'D']];
    const get = createArrayGetter(jagged);
    expect(get(0, 0)).toBe('A');
    expect(get(0, 1)).toBeNull();
    expect(get(1, 2)).toBe('D');
    expect(get(1, 3)).toBeNull();
  });

  it('preserves numeric and string cell types', () => {
    const board = [
      [0, 1],
      [2, 3],
    ];
    const get = createArrayGetter(board);
    expect(get(0, 0)).toBe(0);
    expect(typeof get(1, 1)).toBe('number');
  });

  it('empty board getter always returns null', () => {
    const get = createArrayGetter([]);
    expect(get(0, 0)).toBeNull();
    expect(get(-1, -1)).toBeNull();
  });
});

describe('Wave 24 grid-bounds — wrap round-trips with isInBounds', () => {
  it('every wrap of offsets in [-rows*2, rows*2] stays in bounds', () => {
    const rows = 3;
    const cols = 5;
    for (let r = -rows * 2; r <= rows * 2; r++) {
      for (let c = -cols * 2; c <= cols * 2; c++) {
        const w = wrapPosition(r, c, rows, cols);
        expect(isInBounds(w.row, w.col, rows, cols)).toBe(true);
        expect(w.row).toBeGreaterThanOrEqual(0);
        expect(w.row).toBeLessThan(rows);
        expect(w.col).toBeGreaterThanOrEqual(0);
        expect(w.col).toBeLessThan(cols);
      }
    }
  });

  it('wrapping twice by full dimensions is identity for in-bounds cells', () => {
    expect(wrapPosition(1 + 7, 2 + 7, 7, 7)).toEqual({ row: 1, col: 2 });
    expect(wrapPosition(1 - 7, 2 - 7, 7, 7)).toEqual({ row: 1, col: 2 });
  });
});
