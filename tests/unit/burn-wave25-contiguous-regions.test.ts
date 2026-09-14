/**
 * Wave 25 — contiguous region flood / filter / connect / count APIs.
 * Distinct from #133 grid-alignment winners and wave 21 hex-region smoke.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  getNeighbors,
  getHexNeighbors,
  findRegion,
  findAllRegions,
  findRegionsForValue,
  getLargestRegion,
  areConnected,
  countRegionsByValue,
} from '../../src/core/alignment/contiguous';
import type {
  CellGetter,
  CellValue,
  ContiguousConfig,
  GridPosition,
} from '../../src/core/alignment/types';

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

const posKey = (p: GridPosition) => `${p.row},${p.col}`;

describe('Wave 25 contiguous-regions — findRegion', () => {
  it('returns null on empty / undefined start', () => {
    const { getCell, config } = grid([
      [null, 'X'],
      ['X', 'X'],
    ]);
    expect(findRegion(0, 0, getCell, config)).toBeNull();
    const sparse: CellGetter = (r, c) =>
      r === 0 && c === 0 ? undefined : getCell(r, c);
    expect(findRegion(0, 0, sparse, config)).toBeNull();
  });

  it('single occupied cell is a size-1 region', () => {
    const { getCell, config } = grid([
      [null, null],
      [null, 'Q'],
    ]);
    const region = findRegion(1, 1, getCell, config);
    expect(region).toEqual({
      value: 'Q',
      size: 1,
      positions: [{ row: 1, col: 1 }],
    });
  });

  it('4-way flood stops at diagonals-only contact', () => {
    const { getCell, config } = grid([
      ['A', null, 'A'],
      [null, 'A', null],
      ['A', null, 'A'],
    ]);
    const region = findRegion(0, 0, getCell, config)!;
    expect(region.size).toBe(1);
    expect(region.positions).toEqual([{ row: 0, col: 0 }]);
  });

  it('8-way flood merges diagonal checkerboard into one region', () => {
    const { getCell, config } = grid([
      ['A', null, 'A'],
      [null, 'A', null],
      ['A', null, 'A'],
    ]);
    const region = findRegion(0, 0, getCell, { ...config, includeDiagonals: true })!;
    expect(region.value).toBe('A');
    expect(region.size).toBe(5);
  });

  it('stops at different values and null barriers', () => {
    const { getCell, config } = grid([
      ['R', 'R', 'B'],
      ['R', null, 'B'],
      ['B', 'B', 'B'],
    ]);
    const red = findRegion(0, 0, getCell, config)!;
    expect(red.size).toBe(3);
    expect(red.positions.every((p) => getCell(p.row, p.col) === 'R')).toBe(
      true
    );
  });

  it('accepts custom neighbor function (hex)', () => {
    const { getCell, config } = grid([
      ['H', 'H', null],
      ['H', null, null],
      [null, null, null],
    ]);
    const region = findRegion(0, 0, getCell, config, getHexNeighbors)!;
    expect(region.size).toBeGreaterThanOrEqual(2);
    expect(region.value).toBe('H');
  });

  it('wrap reconnects edge cells of same value', () => {
    const { getCell, config } = grid([
      ['T', null, 'T'],
      [null, null, null],
      [null, null, null],
    ]);
    const wrapped = findRegion(0, 0, getCell, { ...config, wrap: true })!;
    expect(wrapped.size).toBe(2);
    expect(wrapped.positions.map(posKey).sort()).toEqual(['0,0', '0,2']);
  });
});

describe('Wave 25 contiguous-regions — findAllRegions / forValue / largest', () => {
  it('findAllRegions skips nulls and groups components', () => {
    const { getCell, config } = grid([
      ['A', null, 'A'],
      [null, 'B', null],
      ['A', null, 'B'],
    ]);
    const all = findAllRegions(getCell, config);
    expect(all).toHaveLength(5);
    expect(all.filter((r) => r.value === 'A')).toHaveLength(3);
    expect(all.filter((r) => r.value === 'B')).toHaveLength(2);
  });

  it('empty board yields no regions', () => {
    const { getCell, config } = grid([
      [null, null],
      [null, null],
    ]);
    expect(findAllRegions(getCell, config)).toEqual([]);
  });

  it('fully filled uniform board is one region', () => {
    const { getCell, config } = grid([
      ['X', 'X', 'X'],
      ['X', 'X', 'X'],
    ]);
    const all = findAllRegions(getCell, config);
    expect(all).toHaveLength(1);
    expect(all[0].size).toBe(6);
  });

  it('findRegionsForValue filters and returns empty for missing value', () => {
    const { getCell, config } = grid([
      ['A', 'A', null],
      [null, 'B', 'B'],
      ['A', null, null],
    ]);
    const aRegions = findRegionsForValue('A', getCell, config);
    expect(aRegions).toHaveLength(2);
    expect(aRegions.every((r) => r.value === 'A')).toBe(true);
    expect(findRegionsForValue('Z', getCell, config)).toEqual([]);
    expect(findRegionsForValue(null, getCell, config)).toEqual([]);
  });

  it('getLargestRegion picks max size and null when absent', () => {
    const { getCell, config } = grid([
      ['G', 'G', null, 'G'],
      ['G', null, null, null],
      [null, 'G', 'G', null],
    ]);
    const largest = getLargestRegion('G', getCell, config)!;
    expect(largest.size).toBe(3);
    expect(getLargestRegion('Z', getCell, config)).toBeNull();
  });

  it('getLargestRegion tie keeps first-seen (stable reduce)', () => {
    const { getCell, config } = grid([
      ['T', 'T', null, 'T', 'T'],
      [null, null, null, null, null],
    ]);
    const largest = getLargestRegion('T', getCell, config)!;
    expect(largest.size).toBe(2);
    // first component encountered is left pair
    expect(largest.positions.map(posKey).sort()).toEqual(['0,0', '0,1']);
  });

  it('8-way findAllRegions merges diagonal contacts', () => {
    const { getCell, config } = grid([
      ['D', null],
      [null, 'D'],
    ]);
    expect(findAllRegions(getCell, config)).toHaveLength(2);
    expect(
      findAllRegions(getCell, { ...config, includeDiagonals: true })
    ).toHaveLength(1);
  });
});

describe('Wave 25 contiguous-regions — areConnected', () => {
  it('returns false when start is empty', () => {
    const { getCell, config } = grid([
      [null, 'X'],
      ['X', 'X'],
    ]);
    expect(
      areConnected({ row: 0, col: 0 }, { row: 1, col: 1 }, getCell, config)
    ).toBe(false);
  });

  it('same cell is connected to itself when occupied', () => {
    const { getCell, config } = grid([['S']]);
    expect(
      areConnected({ row: 0, col: 0 }, { row: 0, col: 0 }, getCell, config)
    ).toBe(true);
  });

  it('4-way vs 8-way connectivity for diagonal pair', () => {
    const { getCell, config } = grid([
      ['P', null],
      [null, 'P'],
    ]);
    expect(
      areConnected({ row: 0, col: 0 }, { row: 1, col: 1 }, getCell, config)
    ).toBe(false);
    expect(
      areConnected(
        { row: 0, col: 0 },
        { row: 1, col: 1 },
        getCell,
        { ...config, includeDiagonals: true }
      )
    ).toBe(true);
  });

  it('different values are not connected even if adjacent', () => {
    const { getCell, config } = grid([
      ['A', 'B'],
      ['B', 'A'],
    ]);
    expect(
      areConnected({ row: 0, col: 0 }, { row: 0, col: 1 }, getCell, config)
    ).toBe(false);
  });

  it('wrap can connect opposite-edge same-value cells', () => {
    const { getCell, config } = grid([
      ['W', null, 'W'],
      [null, null, null],
      [null, null, null],
    ]);
    expect(
      areConnected({ row: 0, col: 0 }, { row: 0, col: 2 }, getCell, config)
    ).toBe(false);
    expect(
      areConnected(
        { row: 0, col: 0 },
        { row: 0, col: 2 },
        getCell,
        { ...config, wrap: true }
      )
    ).toBe(true);
  });

  it('custom neighbor fn changes connectivity', () => {
    const { getCell, config } = grid([
      ['H', null, 'H'],
      [null, null, null],
      [null, null, null],
    ]);
    // square 4-way: not connected
    expect(
      areConnected({ row: 0, col: 0 }, { row: 0, col: 2 }, getCell, config)
    ).toBe(false);
    // still not via hex without middle cell — assert API accepts hex fn
    expect(
      areConnected(
        { row: 0, col: 0 },
        { row: 0, col: 2 },
        getCell,
        config,
        getHexNeighbors
      )
    ).toBe(false);
    // with middle filled, hex path along row works like square
    const { getCell: g2, config: c2 } = grid([
      ['H', 'H', 'H'],
      [null, null, null],
    ]);
    expect(
      areConnected({ row: 0, col: 0 }, { row: 0, col: 2 }, g2, c2, getHexNeighbors)
    ).toBe(true);
  });
});

describe('Wave 25 contiguous-regions — countRegionsByValue', () => {
  it('returns empty map for empty board', () => {
    const { getCell, config } = grid([
      [null, null],
      [null, null],
    ]);
    expect(countRegionsByValue(getCell, config).size).toBe(0);
  });

  it('tallies separate components per value', () => {
    const { getCell, config } = grid([
      [1, null, 1],
      [null, 2, null],
      [1, null, 2],
    ]);
    const counts = countRegionsByValue(getCell, config);
    expect(counts.get(1)).toBe(3);
    expect(counts.get(2)).toBe(2);
    expect(counts.has(null as unknown as CellValue)).toBe(false);
  });

  it('merged 8-way reduces component counts', () => {
    const { getCell, config } = grid([
      ['X', null, 'X'],
      [null, 'X', null],
      ['X', null, 'X'],
    ]);
    expect(countRegionsByValue(getCell, config).get('X')).toBe(5);
    expect(
      countRegionsByValue(getCell, {
        ...config,
        includeDiagonals: true,
      }).get('X')
    ).toBe(1);
  });

  it('numeric and string values coexist in the map', () => {
    const { getCell, config } = grid([
      [7, 'A'],
      ['A', 7],
    ]);
    const counts = countRegionsByValue(getCell, config);
    expect(counts.get(7)).toBe(2);
    expect(counts.get('A')).toBe(2);
  });

  it('respects custom neighbor function for counting', () => {
    const { getCell, config } = grid([
      ['R', 'R'],
      ['R', null],
    ]);
    const square = countRegionsByValue(getCell, config, getNeighbors);
    const hex = countRegionsByValue(getCell, config, getHexNeighbors);
    expect(square.get('R')).toBe(1);
    expect(hex.get('R')).toBe(1);
  });
});
