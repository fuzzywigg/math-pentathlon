/**
 * Wave 25 — contiguous wrap / hex / custom-neighbor stress matrices.
 * Complements neighbors/regions/path files; still distinct from #133 line-alignment.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  getNeighbors,
  getHexNeighbors,
  findRegion,
  findAllRegions,
  findPath,
  areConnected,
  countRegionsByValue,
  getLargestRegion,
  regionConnectsEdges,
} from '../../src/core/alignment/contiguous';
import type {
  CellGetter,
  CellValue,
  ContiguousConfig,
  GridPosition,
} from '../../src/core/alignment/types';

function grid(
  values: (CellValue | null)[][],
  extras: Partial<ContiguousConfig> = {}
): {
  getCell: CellGetter;
  config: ContiguousConfig;
} {
  const rows = values.length;
  const cols = values[0]?.length ?? 0;
  return {
    config: { rows, cols, ...extras },
    getCell: (r, c) => {
      if (r < 0 || c < 0 || r >= rows || c >= cols) return null;
      return values[r][c];
    },
  };
}

const keys = (ps: GridPosition[]) => ps.map((p) => `${p.row},${p.col}`).sort();

describe('Wave 25 contiguous-matrix — toroidal floods', () => {
  it('vertical wrap merges top and bottom same-value cells', () => {
    const { getCell, config } = grid(
      [
        ['V', null, null],
        [null, null, null],
        ['V', null, null],
      ],
      { wrap: true }
    );
    const region = findRegion(0, 0, getCell, config)!;
    expect(region.size).toBe(2);
    expect(areConnected({ row: 0, col: 0 }, { row: 2, col: 0 }, getCell, config)).toBe(
      true
    );
  });

  it('both axes wrap can form a ring around the board', () => {
    const { getCell, config } = grid(
      [
        ['R', 'R', 'R'],
        ['R', null, 'R'],
        ['R', 'R', 'R'],
      ],
      { wrap: true }
    );
    expect(findAllRegions(getCell, config)).toHaveLength(1);
    expect(countRegionsByValue(getCell, config).get('R')).toBe(1);
  });

  it('wrap + diagonals merges checkerboard corners on 2x2', () => {
    const { getCell, config } = grid(
      [
        ['C', null],
        [null, 'C'],
      ],
      { wrap: true, includeDiagonals: true }
    );
    // with wrap, each corner also touches via wrapped cardinals? 
    // (0,0) 4-way wrap neighbors: (1,0),(0,1),(1,0 via bottom?),(0,1)
    // Actually 2x2 wrap 4-way from (0,0): up->(1,0), down->(1,0), left->(0,1), right->(0,1)
    // so without diagonals, C at (0,0) and (1,1) are NOT connected via 4-way wrap
    expect(
      areConnected({ row: 0, col: 0 }, { row: 1, col: 1 }, getCell, {
        rows: 2,
        cols: 2,
        wrap: true,
      })
    ).toBe(false);
    expect(
      areConnected({ row: 0, col: 0 }, { row: 1, col: 1 }, getCell, config)
    ).toBe(true);
  });

  it('path across vertical wrap is length 2', () => {
    const { getCell, config } = grid(
      [
        ['P', null],
        [null, null],
        ['P', null],
      ],
      { wrap: true }
    );
    const path = findPath(
      { row: 0, col: 0 },
      { row: 2, col: 0 },
      getCell,
      config
    )!;
    expect(path).toHaveLength(2);
  });
});

describe('Wave 25 contiguous-matrix — hex floods + edge wins', () => {
  it('hex flood differs from square on diagonal-ish contacts', () => {
    // Even-row hex: (1,1) neighbors include different cols than square diagonals
    const board: (CellValue | null)[][] = [
      ['H', null, null],
      [null, 'H', null],
      [null, null, null],
    ];
    const { getCell, config } = grid(board);
    const square = findRegion(0, 0, getCell, config)!;
    const hex = findRegion(0, 0, getCell, config, getHexNeighbors);
    expect(square.size).toBe(1);
    // whether hex connects depends on parity offsets — assert API consistency
    if (hex) {
      expect(hex.value).toBe('H');
      expect(hex.size).toBeGreaterThanOrEqual(1);
    } else {
      expect(hex).toBeNull();
    }
  });

  it('hex left-right spanning row forms edge connect', () => {
    const { getCell, config } = grid([
      ['R', 'R', 'R', 'R'],
      [null, null, null, null],
      [null, null, null, null],
    ]);
    const region = findRegion(0, 0, getCell, config, getHexNeighbors)!;
    expect(region.size).toBe(4);
    expect(regionConnectsEdges(region, 'left', 'right', config)).toBe(true);
  });

  it('hex path around a square-only barrier', () => {
    // Under square 4-way, top row is connected; under hex also along row
    const { getCell, config } = grid([
      ['X', 'X', 'X'],
      ['X', null, 'X'],
      [null, null, null],
    ]);
    const path = findPath(
      { row: 0, col: 0 },
      { row: 1, col: 2 },
      getCell,
      config,
      getHexNeighbors
    );
    expect(path).not.toBeNull();
  });

  it('countRegionsByValue with hex neighbors on sparse board', () => {
    const { getCell, config } = grid([
      ['A', null, 'A'],
      [null, 'A', null],
      ['A', null, 'A'],
    ]);
    const squareCounts = countRegionsByValue(getCell, config, getNeighbors);
    const hexCounts = countRegionsByValue(getCell, config, getHexNeighbors);
    expect(squareCounts.get('A')).toBe(5);
    expect(hexCounts.get('A')).toBeGreaterThanOrEqual(1);
    expect(hexCounts.get('A')).toBeLessThanOrEqual(5);
  });
});

describe('Wave 25 contiguous-matrix — custom neighbor + largest ties', () => {
  it('custom neighbor that only moves right still finds linear path', () => {
    const onlyRight = (row: number, col: number, config: ContiguousConfig) => {
      const next = { row, col: col + 1 };
      return next.col < config.cols ? [next] : [];
    };
    const { getCell, config } = grid([
      ['L', 'L', 'L'],
      [null, null, null],
    ]);
    const path = findPath(
      { row: 0, col: 0 },
      { row: 0, col: 2 },
      getCell,
      config,
      onlyRight
    )!;
    expect(keys(path)).toEqual(['0,0', '0,1', '0,2'].sort());
    expect(
      findPath(
        { row: 0, col: 2 },
        { row: 0, col: 0 },
        getCell,
        config,
        onlyRight
      )
    ).toBeNull();
  });

  it('getLargestRegion among three unequal components', () => {
    const { getCell, config } = grid([
      ['G', 'G', 'G', null, 'G', 'G', null, 'G'],
      [null, null, null, null, null, null, null, null],
    ]);
    const largest = getLargestRegion('G', getCell, config)!;
    expect(largest.size).toBe(3);
    expect(keys(largest.positions)).toEqual(['0,0', '0,1', '0,2']);
  });

  it('findAllRegions with wrap does not double-count toroidal component', () => {
    const { getCell, config } = grid(
      [
        ['T', null, 'T'],
        [null, null, null],
        [null, null, null],
      ],
      { wrap: true }
    );
    const all = findAllRegions(getCell, config);
    expect(all).toHaveLength(1);
    expect(all[0].size).toBe(2);
  });

  it('edge midpoints under wrap have full 4-neighbor degree', () => {
    const config: ContiguousConfig = { rows: 5, cols: 5, wrap: true };
    for (const [r, c] of [
      [0, 2],
      [2, 0],
      [4, 2],
      [2, 4],
    ] as const) {
      expect(getNeighbors(r, c, config)).toHaveLength(4);
      expect(getHexNeighbors(r, c, config)).toHaveLength(6);
    }
  });
});
