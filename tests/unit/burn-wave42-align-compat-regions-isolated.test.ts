/**
 * Wave 42 — isIsolated / countRegions / getRegionStats leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  isIsolated,
  countRegions,
  getRegionStats,
  findAllRegions,
  areConnected,
  createArrayAccessor,
  getArrayDimensions,
} from '../../src/core/alignment';

describe('Wave 42 align-compat — regions isolated', () => {
  const grid = [
    ['A', 'A', null],
    [null, 'B', null],
    ['C', null, 'C'],
  ];
  const dims = getArrayDimensions(grid);
  const get = createArrayAccessor(grid);

  it('paired A cells are not isolated', () => {
    expect(isIsolated({ row: 0, col: 0 }, dims, get)).toBe(false);
  });

  it('singleton B is isolated under 4-connect', () => {
    expect(isIsolated({ row: 1, col: 1 }, dims, get)).toBe(true);
  });

  it('countRegions counts non-null islands (and null island)', () => {
    const n = countRegions(dims, get);
    expect(n).toBeGreaterThanOrEqual(3);
  });

  it('filter keeps only value A', () => {
    const regions = findAllRegions(dims, get, {}, (v) => v === 'A');
    expect(regions).toHaveLength(1);
    expect(regions[0].size).toBe(2);
  });

  it('getRegionStats averageSize matches total/count', () => {
    const stats = getRegionStats(dims, get, {}, (v) => v === 'A' || v === 'B');
    expect(stats.count).toBe(2);
    expect(stats.totalSize).toBe(3);
    expect(stats.averageSize).toBe(1.5);
    expect(stats.minSize).toBe(1);
    expect(stats.maxSize).toBe(2);
  });

  it('diagonal C cells disconnected under 4-connect', () => {
    expect(
      areConnected(
        { row: 2, col: 0 },
        { row: 2, col: 2 },
        dims,
        get,
        { connectivity: 4 }
      )
    ).toBe(false);
  });
});
