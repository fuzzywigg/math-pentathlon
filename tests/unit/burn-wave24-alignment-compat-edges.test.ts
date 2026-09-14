/**
 * Wave 24 — alignment compat ergonomic API edges (filter / isolation / stats).
 * Deepens compat wrappers beyond alignment.test.ts smoke; distinct from contiguous/grid core files.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import {
  createArrayAccessor,
  getArrayDimensions,
  findAllRegions,
  findLargestRegion,
  getRegionSize,
  isIsolated,
  countRegions,
  getRegionStats,
  hasAlignment,
  findAlignmentsThrough,
  countMaxAligned,
  findAlignmentAt,
  ALL_DIRECTIONS,
} from '../../src/core/alignment';

describe('Wave 24 compat — dimensions / accessor OOB', () => {
  it('empty grid dimensions and accessor undefined OOB', () => {
    expect(getArrayDimensions([])).toEqual({ rows: 0, cols: 0 });
    const grid = [
      [1, 2],
      [3, 4],
    ];
    expect(getArrayDimensions(grid)).toEqual({ rows: 2, cols: 2 });
    const get = createArrayAccessor(grid);
    expect(get(0, 0)).toBe(1);
    expect(get(-1, 0)).toBeUndefined();
    expect(get(0, 9)).toBeUndefined();
  });
});

describe('Wave 24 compat — region filter / isolation / stats', () => {
  const grid = [
    [1, 1, 0, 2],
    [1, 0, 2, 2],
    [0, 3, 3, 0],
    [4, 0, 0, 1],
  ];
  const dims = getArrayDimensions(grid);
  const get = createArrayAccessor(grid);

  it('findAllRegions filter predicate and largest for value', () => {
    const ones = findAllRegions(dims, get, { connectivity: 4 }, (v) => v === 1);
    expect(ones.every((r) => r.value === 1)).toBe(true);
    expect(ones.length).toBe(2);
    const largestOne = findLargestRegion(
      dims,
      get,
      { connectivity: 4 },
      (v) => v === 1
    );
    expect(largestOne?.size).toBe(3);
    expect(
      findLargestRegion(dims, get, { connectivity: 4 }, (v) => v === 99)
    ).toBeNull();
  });

  it('getRegionSize / isIsolated / countRegions / getRegionStats', () => {
    expect(getRegionSize({ row: 0, col: 0 }, dims, get)).toBe(3);
    expect(getRegionSize({ row: 3, col: 0 }, dims, get)).toBe(1);
    expect(isIsolated({ row: 3, col: 0 }, dims, get)).toBe(true);
    expect(isIsolated({ row: 0, col: 0 }, dims, get)).toBe(false);
    expect(countRegions(dims, get)).toBeGreaterThanOrEqual(5);

    const stats = getRegionStats(dims, get);
    expect(stats.count).toBeGreaterThanOrEqual(5);
    expect(stats.maxSize).toBeGreaterThanOrEqual(3);
    expect(stats.averageSize).toBeGreaterThan(0);
    expect(stats.totalSize).toBeGreaterThan(0);
    expect(stats.minSize).toBeGreaterThanOrEqual(1);
  });
});

describe('Wave 24 compat — alignment queries with requiredLength', () => {
  const grid = [
    ['X', 'X', 'X', 'O'],
    ['O', 'X', null, null],
    [null, 'X', null, null],
    ['O', 'O', 'O', null],
  ];
  const dims = getArrayDimensions(grid);
  const get = createArrayAccessor(grid);

  it('hasAlignment / findAlignmentAt / through / countMaxAligned', () => {
    expect(hasAlignment(dims, get, { requiredLength: 3 })).toBe(true);
    expect(hasAlignment(dims, get, { requiredLength: 5 })).toBe(false);

    const at = findAlignmentAt({ row: 0, col: 1 }, 'horizontal', dims, get, {
      requiredLength: 3,
    });
    expect(at).not.toBeNull();
    expect(at!.length).toBeGreaterThanOrEqual(3);

    const through = findAlignmentsThrough({ row: 0, col: 1 }, dims, get, {
      requiredLength: 3,
    });
    expect(through.hasAlignment).toBe(true);
    expect(through.alignments.length).toBeGreaterThan(0);
    expect(
      through.alignments.every((a) =>
        a.positions.some((p) => p.row === 0 && p.col === 1)
      )
    ).toBe(true);

    const maxH = countMaxAligned({ row: 0, col: 0 }, dims, get);
    expect(maxH.count).toBeGreaterThanOrEqual(3);
    const maxV = countMaxAligned({ row: 1, col: 1 }, dims, get);
    expect(maxV.count).toBeGreaterThanOrEqual(2);
    expect(ALL_DIRECTIONS.length).toBe(8);
  });
});
