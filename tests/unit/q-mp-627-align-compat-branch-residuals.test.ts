/**
 * q-mp-627 — Characterize `src/core/alignment/compat.ts` branch residuals.
 *
 * Scoped baseline (post1023 @ fb0d0ec5, `tests/unit/*compat*` only):
 *   70.0% lines / 64.76% branches / 65.78% functions
 * Uncovered clusters included ~215,253,273–345,422,458,515–555,580,603.
 *
 * Pins CURRENT tip behavior — tests-only; no product / knip / ratchet edits.
 * Structural asserts only; no AI move-choice/timing, scoring, or copy pins.
 */
import { describe, expect, it } from 'vitest';

import {
  areConnected,
  checkLineAlignment,
  countMaxAligned,
  countRegions,
  createArrayAccessor,
  findAlignmentAt,
  findAlignmentsThrough,
  findAllAlignments,
  findAllRegions,
  findLargestRegion,
  findRegionAt,
  getLinePositions,
  getNeighbors,
  getRegionSize,
  getRegionStats,
  hasAlignment,
  isIsolated,
} from '../../src/core/alignment/compat';

describe('q-mp-627 align-compat — line / alignment query residuals', () => {
  it('getLinePositions returns null when the run steps out of bounds', () => {
    // L209 true arm: mid-loop OOB → null (not a partial list).
    expect(
      getLinePositions({ row: 0, col: 2 }, 'horizontal', 3, {
        rows: 3,
        cols: 3,
      })
    ).toBeNull();
    expect(
      getLinePositions({ row: 2, col: 0 }, 'vertical', 2, { rows: 3, cols: 3 })
    ).toBeNull();
  });

  it('checkLineAlignment rejects null / undefined first cells', () => {
    const grid = [
      [null, 'X'],
      ['X', 'X'],
    ];
    const get = createArrayAccessor(grid);
    expect(
      checkLineAlignment(
        [
          { row: 0, col: 0 },
          { row: 0, col: 1 },
        ],
        get
      )
    ).toEqual({ isAligned: false, value: null });

    const undefGet = (r: number, c: number) =>
      r === 0 && c === 0 ? undefined : 'X';
    expect(
      checkLineAlignment(
        [
          { row: 0, col: 0 },
          { row: 0, col: 1 },
        ],
        undefGet
      )
    ).toEqual({ isAligned: false, value: null });
  });

  it('findAlignmentAt maps directions, defaults length 4, and nulls misses', () => {
    const grid = [
      ['X', 'X', 'X', 'X', null],
      [null, null, null, null, null],
      [null, 'Y', null, null, null],
      [null, 'Y', null, null, null],
      [null, 'Y', null, null, null],
    ];
    const get = createArrayAccessor(grid);
    const dim = { rows: 5, cols: 5 };

    // Default options → requiredLength 4; direction name → DIRECTIONS key.
    const hit = findAlignmentAt({ row: 0, col: 1 }, 'horizontal', dim, get);
    expect(hit).not.toBeNull();
    expect(hit?.length).toBe(4);
    expect(hit?.direction as unknown).toBe('horizontal');

    // Explicit shorter length on a vertical run of 3.
    const short = findAlignmentAt({ row: 3, col: 1 }, 'vertical', dim, get, {
      requiredLength: 3,
    });
    expect(short?.length).toBe(3);

    // Empty center → findAlignmentFromCenter null → wrapper null.
    expect(
      findAlignmentAt({ row: 1, col: 0 }, 'horizontal', dim, get, {
        requiredLength: 2,
      })
    ).toBeNull();

    // Unknown direction name → !dir early null (cast past DirectionName).
    expect(
      findAlignmentAt(
        { row: 0, col: 0 },
        'not-a-direction' as 'horizontal',
        dim,
        get
      )
    ).toBeNull();

    // In-bounds undefined empties: safeGet true arm (undefined → null) while
    // extending past the filled run.
    const undefBoard = (r: number, c: number) => {
      if (r === 0 && c >= 0 && c <= 2) return 'X';
      return undefined;
    };
    const viaUndef = findAlignmentAt(
      { row: 0, col: 1 },
      'horizontal',
      { rows: 1, cols: 5 },
      undefBoard,
      { requiredLength: 3 }
    );
    expect(viaUndef?.length).toBe(3);
  });

  it('findAllAlignments / hasAlignment scan with default and custom length', () => {
    const grid = [
      ['A', 'A', 'A', null],
      [null, null, null, null],
      ['B', 'B', 'B', 'B'],
      [null, null, null, null],
    ];
    const get = createArrayAccessor(grid);
    const dim = { rows: 4, cols: 4 };

    // Default requiredLength 4 → only the B run.
    const defaults = findAllAlignments(dim, get);
    expect(defaults.hasAlignment).toBe(true);
    expect(defaults.alignments.length).toBeGreaterThanOrEqual(1);
    expect(hasAlignment(dim, get)).toBe(true);

    const threes = findAllAlignments(dim, get, { requiredLength: 3 });
    expect(threes.hasAlignment).toBe(true);
    expect(threes.alignments.length).toBeGreaterThanOrEqual(2);

    const empty = findAllAlignments(dim, () => null, { requiredLength: 3 });
    expect(empty).toEqual({ hasAlignment: false, alignments: [] });
    expect(hasAlignment(dim, () => null, { requiredLength: 3 })).toBe(false);

    // Scan with in-bounds undefined empties (safeGet undefined → null arm).
    const undefGet = (r: number, c: number) => {
      if (r === 0 && c < 4) return 'B';
      return undefined;
    };
    const viaUndef = findAllAlignments({ rows: 2, cols: 4 }, undefGet, {
      requiredLength: 4,
    });
    expect(viaUndef.hasAlignment).toBe(true);
  });

  it('findAlignmentsThrough maps undefined cells and dedupes length-1 axes', () => {
    const dim = { rows: 3, cols: 3 };
    // undefined (not null) at the seed — safeGet coerces to null → no alignments.
    const undefGet = () => undefined;
    const miss = findAlignmentsThrough({ row: 1, col: 1 }, dim, undefGet, {
      requiredLength: 2,
    });
    expect(miss.hasAlignment).toBe(false);

    // Lone cell with requiredLength 1: all four axes share the same position key
    // → first alignment kept, subsequent directions hit the dedupe skip arm.
    const lone = [
      [null, null, null],
      [null, 'Z', null],
      [null, null, null],
    ];
    const get = createArrayAccessor(lone);
    const through = findAlignmentsThrough({ row: 1, col: 1 }, dim, get, {
      requiredLength: 1,
    });
    expect(through.hasAlignment).toBe(true);
    expect(through.alignments).toHaveLength(1);
    expect(through.alignments[0]?.positions).toEqual([{ row: 1, col: 1 }]);
  });

  it('countMaxAligned empty-cell fallback and undefined→null coercion', () => {
    const dim = { rows: 3, cols: 3 };
    const fallback = countMaxAligned({ row: 1, col: 1 }, dim, () => undefined);
    expect(fallback).toEqual({
      count: 1,
      direction: 'horizontal',
      positions: [{ row: 1, col: 1 }],
    });

    const grid = [
      [null, 'Q', null],
      [null, 'Q', null],
      [null, 'Q', null],
    ];
    const best = countMaxAligned(
      { row: 1, col: 1 },
      dim,
      createArrayAccessor(grid)
    );
    expect(best.count).toBe(3);
    expect(best.direction).toBe('vertical');
  });
});

describe('q-mp-627 align-compat — contiguous region residuals', () => {
  const grid = [
    ['X', 'X', null, 'O'],
    ['X', null, null, 'O'],
    [null, null, 'Y', 'Y'],
    [null, null, 'Y', null],
  ];
  const get = createArrayAccessor(grid);
  const dim = { rows: 4, cols: 4 };

  it('getNeighbors default connectivity is 4-way', () => {
    const center4 = getNeighbors({ row: 1, col: 1 }, { rows: 3, cols: 3 });
    expect(center4).toHaveLength(4);
    const corner8 = getNeighbors({ row: 0, col: 0 }, { rows: 3, cols: 3 }, 8);
    expect(corner8).toHaveLength(3);
  });

  it('findLargestRegion empty filter vs reduce across sizes', () => {
    expect(
      findLargestRegion(dim, get, { connectivity: 4 }, () => false)
    ).toBeNull();

    const largest = findLargestRegion(dim, get, { connectivity: 4 });
    expect(largest).not.toBeNull();
    expect(largest?.size).toBe(3);
    expect(['X', 'Y']).toContain(largest?.value);

    const onlyO = findLargestRegion(
      dim,
      get,
      { connectivity: 4 },
      (v) => v === 'O'
    );
    expect(onlyO?.value).toBe('O');
    expect(onlyO?.size).toBe(2);

    // Small region scanned before a larger one → reduce true arm (b.size > a.size).
    const growing = [
      ['A', null, 'B', 'B'],
      [null, null, 'B', 'B'],
    ];
    const gGrow = createArrayAccessor(growing);
    const bigLater = findLargestRegion(
      { rows: 2, cols: 4 },
      gGrow,
      { connectivity: 4 },
      (v) => v === 'A' || v === 'B'
    );
    expect(bigLater?.value).toBe('B');
    expect(bigLater?.size).toBe(4);
  });

  it('areConnected true/false under default and 8-connectivity', () => {
    expect(areConnected({ row: 0, col: 0 }, { row: 1, col: 0 }, dim, get)).toBe(
      true
    );
    expect(
      areConnected({ row: 0, col: 0 }, { row: 0, col: 3 }, dim, get, {
        connectivity: 4,
      })
    ).toBe(false);

    // Diagonal-only link: disconnected at 4, connected at 8.
    const diag = [
      ['A', null],
      [null, 'A'],
    ];
    const g2 = createArrayAccessor(diag);
    const d2 = { rows: 2, cols: 2 };
    expect(
      areConnected({ row: 0, col: 0 }, { row: 1, col: 1 }, d2, g2, {
        connectivity: 4,
      })
    ).toBe(false);
    expect(
      areConnected({ row: 0, col: 0 }, { row: 1, col: 1 }, d2, g2, {
        connectivity: 8,
      })
    ).toBe(true);

    // In-bounds undefined empties coerce via areConnected safeGet.
    const undefGet = (r: number, c: number) => {
      if ((r === 0 && c === 0) || (r === 0 && c === 1)) return 'P';
      return undefined;
    };
    expect(
      areConnected(
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { rows: 2, cols: 2 },
        undefGet
      )
    ).toBe(true);
  });

  it('getRegionSize returns size or 0 when region is null', () => {
    expect(getRegionSize({ row: 0, col: 0 }, dim, get)).toBe(3);
    expect(getRegionSize({ row: 0, col: 2 }, dim, get)).toBe(0);
  });

  it('isIsolated treats null-cell region as size 0 (not isolated)', () => {
    // region null → (0) === 1 → false; covers ?? 0 when region missing.
    expect(isIsolated({ row: 0, col: 2 }, dim, get, { connectivity: 4 })).toBe(
      false
    );
  });

  it('countRegions with and without filter', () => {
    const all = countRegions(dim, get, { connectivity: 4 });
    expect(all).toBe(findAllRegions(dim, get, { connectivity: 4 }).length);
    expect(all).toBeGreaterThanOrEqual(3);

    expect(countRegions(dim, get, { connectivity: 4 }, (v) => v === 'X')).toBe(
      1
    );
    expect(countRegions(dim, get, {}, () => false)).toBe(0);
  });

  it('getRegionStats empty filter returns zeroed summary', () => {
    expect(getRegionStats(dim, get, { connectivity: 4 }, () => false)).toEqual({
      count: 0,
      totalSize: 0,
      minSize: 0,
      maxSize: 0,
      averageSize: 0,
    });
  });

  it('findRegionAt / findAllRegions coerce undefined cells via safeGet', () => {
    const undefGet = (r: number, c: number) => {
      if (r === 0 && c === 0) return 'P';
      if (r === 0 && c === 1) return 'P';
      return undefined;
    };
    const region = findRegionAt(
      { row: 0, col: 0 },
      { rows: 2, cols: 2 },
      undefGet
    );
    expect(region?.size).toBe(2);
    const regions = findAllRegions(
      { rows: 2, cols: 2 },
      undefGet,
      { connectivity: 4 },
      (v) => v === 'P'
    );
    expect(regions).toHaveLength(1);
  });
});
