/**
 * Wave 39 — getRegionStats empty + filter leftovers.
 * Beyond wave 25 contig scan. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { getRegionStats } from '../../src/core/alignment';

describe('Wave 39 align — region stats empty/filter', () => {
  const dims = { rows: 3, cols: 3 };

  it('all-null board yields zero stats', () => {
    const stats = getRegionStats(dims, () => null);
    expect(stats).toEqual({
      count: 0,
      totalSize: 0,
      minSize: 0,
      maxSize: 0,
      averageSize: 0,
    });
  });

  it('two singleton regions report count/avg', () => {
    const board = [
      ['A', null, 'B'],
      [null, null, null],
      [null, null, null],
    ];
    const get = (r: number, c: number) => board[r]?.[c] ?? null;
    const stats = getRegionStats(dims, get);
    expect(stats.count).toBe(2);
    expect(stats.totalSize).toBe(2);
    expect(stats.minSize).toBe(1);
    expect(stats.maxSize).toBe(1);
    expect(stats.averageSize).toBe(1);
  });

  it('filter predicate keeps only matching values', () => {
    const board = [
      ['A', 'A', null],
      [null, 'B', null],
      [null, null, null],
    ];
    const get = (r: number, c: number) => board[r]?.[c] ?? null;
    const stats = getRegionStats(dims, get, {}, (v) => v === 'A');
    expect(stats.count).toBe(1);
    expect(stats.totalSize).toBe(2);
    expect(stats.maxSize).toBe(2);
  });
});
