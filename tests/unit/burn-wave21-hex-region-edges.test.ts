/**
 * Wave 21 — alignment contiguous hex/path/region edges (Hex-style connectivity).
 * Distinct from alignment.test smoke and wave 18 Hex path emptiness.
 * Imports contiguous primitives directly (compat shadows some names).
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import {
  getHexNeighbors,
  findRegion,
  findAllRegions,
  findRegionsForValue,
  regionTouchesEdge,
  regionConnectsEdges,
  findPath,
  countRegionsByValue,
  getLargestRegion,
  type ContiguousConfig,
  type CellGetter,
  type CellValue,
} from '../../src/core/alignment/contiguous';

afterEach(() => {
  vi.restoreAllMocks();
});

function grid(values: (CellValue | null)[][]): {
  getCell: CellGetter;
  config: ContiguousConfig;
} {
  const rows = values.length;
  const cols = values[0]?.length ?? 0;
  return {
    config: { rows, cols },
    getCell: (r, c) => {
      if (r < 0 || c < 0 || r >= rows || c >= cols) return null;
      return values[r][c];
    },
  };
}

describe('Wave 21 hex-region — getHexNeighbors odd/even + wrap', () => {
  it('returns up to 6 in-bounds neighbors and differs by row parity', () => {
    const config: ContiguousConfig = { rows: 5, cols: 5 };
    const even = getHexNeighbors(2, 2, config);
    const odd = getHexNeighbors(3, 2, config);
    expect(even.length).toBeGreaterThanOrEqual(4);
    expect(odd.length).toBeGreaterThanOrEqual(4);
    expect(even.map((p) => `${p.row},${p.col}`).sort()).not.toEqual(
      odd.map((p) => `${p.row},${p.col}`).sort()
    );

    const edge = getHexNeighbors(0, 0, config);
    expect(edge.every((p) => p.row >= 0 && p.col >= 0)).toBe(true);

    const wrapped = getHexNeighbors(0, 0, { rows: 3, cols: 3, wrap: true });
    expect(wrapped.length).toBe(6);
  });
});

describe('Wave 21 hex-region — region flood / edge connect / path', () => {
  it('findRegion / findRegionsForValue / getLargestRegion', () => {
    const { getCell, config } = grid([
      ['R', 'R', null],
      ['R', 'B', 'B'],
      [null, 'B', null],
    ]);
    const red = findRegion(0, 0, getCell, config);
    expect(red?.value).toBe('R');
    expect(red?.positions.length).toBe(3);

    const blues = findRegionsForValue('B', getCell, config);
    expect(blues).toHaveLength(1);
    expect(blues[0].positions.length).toBe(3);

    const largestBlue = getLargestRegion('B', getCell, config);
    expect(largestBlue?.positions.length).toBe(3);

    const all = findAllRegions(getCell, config);
    expect(all.length).toBe(2);
  });

  it('regionTouchesEdge / regionConnectsEdges for Hex-style wins', () => {
    const { getCell, config } = grid([
      ['X', null, null],
      ['X', null, null],
      ['X', null, null],
    ]);
    const region = findRegion(0, 0, getCell, config)!;
    expect(regionTouchesEdge(region, 'top', config)).toBe(true);
    expect(regionTouchesEdge(region, 'bottom', config)).toBe(true);
    expect(regionTouchesEdge(region, 'left', config)).toBe(true);
    expect(regionTouchesEdge(region, 'right', config)).toBe(false);
    expect(regionConnectsEdges(region, 'top', 'bottom', config)).toBe(true);
    expect(regionConnectsEdges(region, 'left', 'right', config)).toBe(false);
  });

  it('findPath with square and hex neighbor fns', () => {
    const { getCell, config } = grid([
      ['R', 'R', 'R'],
      [null, null, 'R'],
      [null, null, 'R'],
    ]);
    const path = findPath(
      { row: 0, col: 0 },
      { row: 2, col: 2 },
      getCell,
      config
    );
    expect(path).not.toBeNull();
    expect(path![0]).toEqual({ row: 0, col: 0 });
    expect(path![path!.length - 1]).toEqual({ row: 2, col: 2 });

    expect(
      findPath({ row: 0, col: 0 }, { row: 2, col: 0 }, getCell, config)
    ).toBeNull();

    const hexPath = findPath(
      { row: 0, col: 0 },
      { row: 0, col: 2 },
      getCell,
      config,
      getHexNeighbors
    );
    expect(hexPath).not.toBeNull();
  });

  it('countRegionsByValue tallies separate components', () => {
    const { getCell, config } = grid([
      ['A', null, 'A'],
      [null, 'B', null],
      ['A', null, 'B'],
    ]);
    const counts = countRegionsByValue(getCell, config);
    expect(counts.get('A')).toBe(3);
    expect(counts.get('B')).toBe(2);
  });
});
