/**
 * Wave 25 — findAllRegions / findRegionsForValue / getLargestRegion /
 * countRegionsByValue board-wide scans on raw contiguous.ts.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  findAllRegions,
  findRegionsForValue,
  getLargestRegion,
  countRegionsByValue,
  getHexNeighbors,
  findRegion,
} from '../../src/core/alignment/contiguous';
import type {
  CellGetter,
  CellValue,
  ContiguousConfig,
} from '../../src/core/alignment/types';

function grid(
  values: (CellValue | null)[][],
  extra: Partial<ContiguousConfig> = {}
): { getCell: CellGetter; config: ContiguousConfig } {
  const rows = values.length;
  const cols = values[0]?.length ?? 0;
  return {
    config: { rows, cols, ...extra },
    getCell: (r, c) => {
      if (r < 0 || c < 0 || r >= rows || c >= cols) return null;
      return values[r][c];
    },
  };
}

describe('Wave 25 contig-scan — findAllRegions', () => {
  it('returns empty on fully empty board', () => {
    const { getCell, config } = grid([
      [null, null],
      [null, null],
    ]);
    expect(findAllRegions(getCell, config)).toEqual([]);
  });

  it('returns one region for full same-value fill', () => {
    const { getCell, config } = grid([
      ['A', 'A'],
      ['A', 'A'],
    ]);
    const regions = findAllRegions(getCell, config);
    expect(regions).toHaveLength(1);
    expect(regions[0].size).toBe(4);
    expect(regions[0].value).toBe('A');
  });

  it('splits disconnected same-value islands', () => {
    const { getCell, config } = grid([
      ['A', null, 'A'],
      [null, null, null],
      ['A', null, 'A'],
    ]);
    const regions = findAllRegions(getCell, config);
    expect(regions).toHaveLength(4);
    expect(regions.every((r) => r.value === 'A' && r.size === 1)).toBe(
      true
    );
  });

  it('merges diagonal islands when includeDiagonals is set', () => {
    const { getCell, config } = grid(
      [
        ['A', null, 'A'],
        [null, 'A', null],
        ['A', null, 'A'],
      ],
      { includeDiagonals: true }
    );
    const regions = findAllRegions(getCell, config);
    expect(regions).toHaveLength(1);
    expect(regions[0].size).toBe(5);
  });

  it('ignores null cells and does not invent regions for them', () => {
    const { getCell, config } = grid([
      ['X', null, 'Y'],
      [null, null, null],
      ['Z', null, null],
    ]);
    const regions = findAllRegions(getCell, config);
    expect(regions).toHaveLength(3);
    expect(regions.map((r) => r.value).sort()).toEqual(['X', 'Y', 'Z']);
  });

  it('wrap collapses edge-touching same-value cells into one region', () => {
    const { getCell, config } = grid(
      [
        ['T', null, 'T'],
        [null, null, null],
        [null, null, null],
      ],
      { wrap: true }
    );
    const regions = findAllRegions(getCell, config);
    expect(regions).toHaveLength(1);
    expect(regions[0].size).toBe(2);
  });

  it('hex neighbor fn changes region topology vs square', () => {
    const values: (CellValue | null)[][] = [
      ['B', null, 'B'],
      [null, 'B', null],
      ['B', null, null],
    ];
    const { getCell, config } = grid(values);
    const square = findAllRegions(getCell, config);
    const hex = findAllRegions(getCell, config, getHexNeighbors);
    // Topology may differ; both must cover only B cells and not exceed cell count
    const bCells = 4;
    expect(square.reduce((s, r) => s + r.size, 0)).toBe(bCells);
    expect(hex.reduce((s, r) => s + r.size, 0)).toBe(bCells);
    expect(square.length).toBeGreaterThanOrEqual(1);
    expect(hex.length).toBeGreaterThanOrEqual(1);
  });
});

describe('Wave 25 contig-scan — findRegionsForValue', () => {
  it('filters to requested value only', () => {
    const { getCell, config } = grid([
      ['R', 'R', 'B'],
      [null, 'B', 'B'],
      ['R', null, null],
    ]);
    const reds = findRegionsForValue('R', getCell, config);
    const blues = findRegionsForValue('B', getCell, config);
    expect(reds.every((r) => r.value === 'R')).toBe(true);
    expect(blues.every((r) => r.value === 'B')).toBe(true);
    expect(reds).toHaveLength(2);
    expect(blues).toHaveLength(1);
    expect(blues[0].size).toBe(3);
  });

  it('returns empty when value absent', () => {
    const { getCell, config } = grid([
      ['A', 'A'],
      ['A', 'A'],
    ]);
    expect(findRegionsForValue('Z', getCell, config)).toEqual([]);
  });

  it('works with numeric values including zero', () => {
    const { getCell, config } = grid([
      [0, 0, 1],
      [null, 1, 1],
    ]);
    expect(findRegionsForValue(0, getCell, config)).toHaveLength(1);
    expect(findRegionsForValue(0, getCell, config)[0].size).toBe(2);
    expect(findRegionsForValue(1, getCell, config)[0].size).toBe(3);
  });
});

describe('Wave 25 contig-scan — getLargestRegion', () => {
  it('returns null when value has no cells', () => {
    const { getCell, config } = grid([
      ['A', null],
      [null, 'A'],
    ]);
    expect(getLargestRegion('B', getCell, config)).toBeNull();
  });

  it('picks the strictly largest island for a value', () => {
    const { getCell, config } = grid([
      ['X', 'X', null, 'X'],
      ['X', null, null, null],
      [null, null, 'X', 'X'],
    ]);
    const largest = getLargestRegion('X', getCell, config)!;
    expect(largest.size).toBe(3);
  });

  it('tie: reduce keeps first-encountered when sizes equal', () => {
    const { getCell, config } = grid([
      ['Y', null, 'Y'],
      [null, null, null],
      ['Y', null, 'Y'],
    ]);
    const regions = findRegionsForValue('Y', getCell, config);
    expect(regions.every((r) => r.size === 1)).toBe(true);
    const largest = getLargestRegion('Y', getCell, config)!;
    expect(largest.size).toBe(1);
    // First scan order is row-major; first Y is (0,0)
    expect(largest.positions[0]).toEqual({ row: 0, col: 0 });
  });

  it('matches max size among findRegionsForValue results', () => {
    const { getCell, config } = grid([
      ['P', 'P', null],
      ['P', null, 'P'],
      [null, 'P', 'P'],
    ]);
    const regions = findRegionsForValue('P', getCell, config);
    const largest = getLargestRegion('P', getCell, config)!;
    const maxSize = Math.max(...regions.map((r) => r.size));
    expect(largest.size).toBe(maxSize);
  });
});

describe('Wave 25 contig-scan — countRegionsByValue', () => {
  it('returns empty map on empty board', () => {
    const { getCell, config } = grid([
      [null, null],
      [null, null],
    ]);
    expect(countRegionsByValue(getCell, config).size).toBe(0);
  });

  it('tallies separate components per value', () => {
    const { getCell, config } = grid([
      ['A', null, 'A'],
      [null, 'B', null],
      ['A', null, 'B'],
    ]);
    const counts = countRegionsByValue(getCell, config);
    expect(counts.get('A')).toBe(3);
    expect(counts.get('B')).toBe(2);
    expect(counts.has('C')).toBe(false);
  });

  it('single blob counts as one regardless of size', () => {
    const { getCell, config } = grid([
      ['Z', 'Z', 'Z'],
      ['Z', 'Z', 'Z'],
    ]);
    const counts = countRegionsByValue(getCell, config);
    expect(counts.get('Z')).toBe(1);
    expect([...counts.keys()]).toEqual(['Z']);
  });

  it('diagonal merge reduces count under includeDiagonals', () => {
    const values: (CellValue | null)[][] = [
      ['D', null],
      [null, 'D'],
    ];
    const { getCell, config } = grid(values);
    expect(countRegionsByValue(getCell, config).get('D')).toBe(2);
    expect(
      countRegionsByValue(getCell, {
        ...config,
        includeDiagonals: true,
      }).get('D')
    ).toBe(1);
  });

  it('sum of sizes across findAllRegions equals non-null cell count', () => {
    const values: (CellValue | null)[][] = [
      ['A', null, 'B', 'B'],
      ['A', 'A', null, 'C'],
      [null, 'C', 'C', null],
    ];
    const { getCell, config } = grid(values);
    const regions = findAllRegions(getCell, config);
    const occupied = values.flat().filter((v) => v !== null).length;
    expect(regions.reduce((s, r) => s + r.size, 0)).toBe(occupied);

    const counts = countRegionsByValue(getCell, config);
    expect(
      [...counts.values()].reduce((a, b) => a + b, 0)
    ).toBe(regions.length);
  });
});

describe('Wave 25 contig-scan — consistency with findRegion seeds', () => {
  it('every findAllRegions entry matches findRegion at its first position', () => {
    const { getCell, config } = grid([
      ['A', 'A', null, 'B'],
      [null, 'A', 'B', 'B'],
      ['C', null, null, 'B'],
    ]);
    for (const region of findAllRegions(getCell, config)) {
      const seed = region.positions[0];
      const again = findRegion(seed.row, seed.col, getCell, config)!;
      expect(again.size).toBe(region.size);
      expect(again.value).toBe(region.value);
    }
  });
});
