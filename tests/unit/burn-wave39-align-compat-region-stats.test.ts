/**
 * Wave 39 — alignment compat region stats / isolated leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  getRegionStats,
  isIsolated,
  countRegions,
  findLargestRegion,
  createArrayAccessor,
} from '../../src/core/alignment';

describe('Wave 39 alignment — region stats', () => {
  const grid = [
    [1, 1, 0, 2],
    [1, 0, 0, 2],
    [0, 0, 3, 3],
    [4, 0, 3, 0],
  ];
  const get = createArrayAccessor(grid);
  const dims = { rows: 4, cols: 4 };

  it('countRegions and largest for value 1', () => {
    expect(countRegions(dims, get, {}, (v) => v === 1)).toBe(1);
    const largest = findLargestRegion(dims, get, {}, (v) => v === 1);
    expect(largest?.size).toBe(3);
  });

  it('getRegionStats aggregates sizes', () => {
    const stats = getRegionStats(dims, get, {}, (v) => v === 3);
    expect(stats.count).toBe(1);
    expect(stats.maxSize).toBe(3);
    expect(stats.totalSize).toBe(3);
  });

  it('isIsolated true for singleton 4', () => {
    expect(isIsolated({ row: 3, col: 0 }, dims, get)).toBe(true);
    expect(isIsolated({ row: 0, col: 0 }, dims, get)).toBe(false);
  });
});
