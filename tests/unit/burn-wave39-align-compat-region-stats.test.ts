/**
 * Wave 39 — compat getRegionStats / isIsolated / countMaxAligned leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createArrayAccessor,
  getRegionStats,
  isIsolated,
  countMaxAligned,
  checkLineAlignment,
  getLinePositions,
  findAlignmentsThrough,
  findRegionAt,
} from '../../src/core/alignment';

describe('Wave 39 align — region stats / isolation', () => {
  const grid = [
    ['X', 'X', null, 'O'],
    ['X', null, null, 'O'],
    [null, null, 'Y', 'Y'],
    [null, null, 'Y', null],
  ];
  const get = createArrayAccessor(grid);
  const dim = { rows: 4, cols: 4 };

  it('getRegionStats aggregates X/O/Y regions', () => {
    const stats = getRegionStats(dim, get, { connectivity: 4 });
    expect(stats.count).toBe(3);
    expect(stats.totalSize).toBe(8);
    expect(stats.maxSize).toBe(3);
    expect(stats.minSize).toBe(2);
    expect(stats.averageSize).toBeCloseTo(8 / 3);

    const onlyX = getRegionStats(dim, get, { connectivity: 4 }, (v) => v === 'X');
    expect(onlyX.count).toBe(1);
    expect(onlyX.totalSize).toBe(3);
  });

  it('isIsolated true for singleton and false for connected', () => {
    expect(isIsolated({ row: 0, col: 3 }, dim, get, { connectivity: 4 })).toBe(
      false
    );
    const sparse = [
      [null, null],
      [null, 'Z'],
    ];
    const g2 = createArrayAccessor(sparse);
    expect(
      isIsolated({ row: 1, col: 1 }, { rows: 2, cols: 2 }, g2, {
        connectivity: 4,
      })
    ).toBe(true);
    expect(findRegionAt({ row: 1, col: 1 }, { rows: 2, cols: 2 }, g2)?.size).toBe(
      1
    );
  });

  it('countMaxAligned and findAlignmentsThrough on sparse board', () => {
    const best = countMaxAligned({ row: 0, col: 0 }, dim, get);
    expect(best.count).toBeGreaterThanOrEqual(2);
    expect(best.positions.length).toBe(best.count);

    const through = findAlignmentsThrough({ row: 0, col: 0 }, dim, get, {
      requiredLength: 2,
    });
    expect(through.hasAlignment).toBe(true);
    expect(through.alignments.length).toBeGreaterThan(0);
  });

  it('checkLineAlignment short vs long lines', () => {
    const line2 = getLinePositions({ row: 0, col: 0 }, 'horizontal', 2, dim)!;
    expect(checkLineAlignment(line2, get).isAligned).toBe(true);
    const line3 = getLinePositions({ row: 0, col: 0 }, 'horizontal', 3, dim)!;
    expect(checkLineAlignment(line3, get).isAligned).toBe(false);
    expect(checkLineAlignment([], get)).toEqual({
      isAligned: false,
      value: null,
    });
  });
});
