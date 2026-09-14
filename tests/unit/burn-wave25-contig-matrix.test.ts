/**
 * Wave 25 — contiguous cross-API matrix: Hex connect-win simulation,
 * wrap torus components, 4 vs 8 connectivity, scan/path/edge consistency.
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
  regionTouchesEdge,
  regionConnectsEdges,
  findPath,
  countRegionsByValue,
} from '../../src/core/alignment/contiguous';
import type {
  CellGetter,
  CellValue,
  ContiguousConfig,
} from '../../src/core/alignment/types';

function grid(
  values: (CellValue | null)[][],
  extra: Partial<ContiguousConfig> = {}
): {
  board: (CellValue | null)[][];
  getCell: CellGetter;
  config: ContiguousConfig;
} {
  const rows = values.length;
  const cols = values[0]?.length ?? 0;
  const board = values.map((row) => [...row]);
  return {
    board,
    config: { rows, cols, ...extra },
    getCell: (r, c) => {
      if (r < 0 || c < 0 || r >= rows || c >= cols) return null;
      return board[r][c];
    },
  };
}

describe('Wave 25 contig-matrix — Hex-style Blue top-bottom win', () => {
  it('detects Blue vertical connection via hex neighbors', () => {
    // 5x5 hex board: Blue column that should touch top+bottom
    const size = 5;
    const values: (CellValue | null)[][] = Array.from(
      { length: size },
      () => Array.from({ length: size }, () => null)
    );
    for (let r = 0; r < size; r++) {
      values[r][0] = 'B';
    }
    const { getCell, config } = grid(values);
    const blues = findRegionsForValue(
      'B',
      getCell,
      config,
      getHexNeighbors
    );
    expect(blues.length).toBeGreaterThanOrEqual(1);
    const bridge = blues.find((r) =>
      regionConnectsEdges(r, 'top', 'bottom', config)
    );
    expect(bridge).toBeDefined();
    expect(regionTouchesEdge(bridge!, 'top', config)).toBe(true);
    expect(regionTouchesEdge(bridge!, 'bottom', config)).toBe(true);
  });

  it('detects Red left-right connection via hex neighbors', () => {
    const size = 5;
    const values: (CellValue | null)[][] = Array.from(
      { length: size },
      () => Array.from({ length: size }, () => null)
    );
    for (let c = 0; c < size; c++) {
      values[2][c] = 'R';
    }
    const { getCell, config } = grid(values);
    const reds = findRegionsForValue(
      'R',
      getCell,
      config,
      getHexNeighbors
    );
    const bridge = reds.find((r) =>
      regionConnectsEdges(r, 'left', 'right', config)
    );
    expect(bridge).toBeDefined();
  });

  it('incomplete Blue column is not a win', () => {
    const values: (CellValue | null)[][] = [
      ['B', null, null],
      ['B', null, null],
      [null, null, null],
    ];
    const { getCell, config } = grid(values);
    const region = findRegion(0, 0, getCell, config, getHexNeighbors)!;
    expect(regionConnectsEdges(region, 'top', 'bottom', config)).toBe(
      false
    );
  });
});

describe('Wave 25 contig-matrix — 4-way vs 8-way topology', () => {
  const checker: (CellValue | null)[][] = [
    ['X', null, 'X'],
    [null, 'X', null],
    ['X', null, 'X'],
  ];

  it('4-way yields five singleton X regions', () => {
    const { getCell, config } = grid(checker);
    const regions = findAllRegions(getCell, config);
    expect(regions).toHaveLength(5);
    expect(countRegionsByValue(getCell, config).get('X')).toBe(5);
  });

  it('8-way merges all X into one region', () => {
    const { getCell, config } = grid(checker, { includeDiagonals: true });
    const regions = findAllRegions(getCell, config);
    expect(regions).toHaveLength(1);
    expect(regions[0].size).toBe(5);
    expect(
      areConnected(
        { row: 0, col: 0 },
        { row: 2, col: 2 },
        getCell,
        config
      )
    ).toBe(true);
    expect(
      findPath(
        { row: 0, col: 0 },
        { row: 2, col: 2 },
        getCell,
        config
      )
    ).not.toBeNull();
  });
});

describe('Wave 25 contig-matrix — wrap torus components', () => {
  it('wrap merges four corner A cells that touch via torus', () => {
    const values: (CellValue | null)[][] = [
      ['A', null, 'A'],
      [null, null, null],
      ['A', null, 'A'],
    ];
    const { getCell, config } = grid(values, { wrap: true });
    // With 4-way wrap, corners connect via edges: (0,0)-(0,2), (0,0)-(2,0), etc.
    const regions = findAllRegions(getCell, config);
    expect(regions).toHaveLength(1);
    expect(regions[0].size).toBe(4);
    expect(
      areConnected(
        { row: 0, col: 0 },
        { row: 2, col: 2 },
        getCell,
        config
      )
    ).toBe(true);
  });

  it('without wrap, four corners are four regions', () => {
    const values: (CellValue | null)[][] = [
      ['A', null, 'A'],
      [null, null, null],
      ['A', null, 'A'],
    ];
    const { getCell, config } = grid(values);
    expect(findAllRegions(getCell, config)).toHaveLength(4);
  });
});

describe('Wave 25 contig-matrix — scan/path/edge consistency', () => {
  it('getLargestRegion size equals max findRegionsForValue size', () => {
    const { getCell, config } = grid([
      ['P', 'P', null, 'P'],
      ['P', null, null, 'P'],
      [null, 'P', 'P', 'P'],
    ]);
    const parts = findRegionsForValue('P', getCell, config);
    const largest = getLargestRegion('P', getCell, config)!;
    expect(largest.size).toBe(Math.max(...parts.map((r) => r.size)));
  });

  it('countRegionsByValue totals equal findAllRegions length', () => {
    const { getCell, config } = grid([
      ['A', 'B', 'A'],
      ['B', null, 'A'],
      ['A', 'B', 'B'],
    ]);
    const all = findAllRegions(getCell, config);
    const counts = countRegionsByValue(getCell, config);
    expect([...counts.values()].reduce((a, b) => a + b, 0)).toBe(
      all.length
    );
  });

  it('regionConnectsEdges iff both edges touched', () => {
    // 4-row board: top T + mid stem, never reaches bottom row 3
    const { getCell, config } = grid([
      ['X', 'X', 'X'],
      [null, 'X', null],
      [null, 'X', null],
      [null, null, null],
    ]);
    const partial = findRegion(0, 0, getCell, config)!;
    expect(regionTouchesEdge(partial, 'top', config)).toBe(true);
    expect(regionTouchesEdge(partial, 'bottom', config)).toBe(false);
    expect(
      regionConnectsEdges(partial, 'top', 'bottom', config)
    ).toBe(false);

    const full = grid([
      ['X', null],
      ['X', null],
      ['X', null],
    ]);
    const bridge = findRegion(0, 0, full.getCell, full.config)!;
    expect(
      regionConnectsEdges(bridge, 'top', 'bottom', full.config)
    ).toBe(
      regionTouchesEdge(bridge, 'top', full.config) &&
        regionTouchesEdge(bridge, 'bottom', full.config)
    );
  });

  it('neighbor counts: center 4 vs 8 matches offset tables', () => {
    const config: ContiguousConfig = { rows: 5, cols: 5 };
    expect(getNeighbors(2, 2, config)).toHaveLength(4);
    expect(
      getNeighbors(2, 2, { ...config, includeDiagonals: true })
    ).toHaveLength(8);
    expect(getHexNeighbors(2, 2, config)).toHaveLength(6);
  });
});

describe('Wave 25 contig-matrix — incremental place simulation', () => {
  it('placing connecting stone merges region counts', () => {
    const { board, getCell, config } = grid([
      ['A', null, 'A'],
      [null, null, null],
      [null, null, null],
    ]);
    expect(countRegionsByValue(getCell, config).get('A')).toBe(2);

    board[0][1] = 'A';
    expect(countRegionsByValue(getCell, config).get('A')).toBe(1);
    expect(getLargestRegion('A', getCell, config)!.size).toBe(3);
    expect(
      findPath(
        { row: 0, col: 0 },
        { row: 0, col: 2 },
        getCell,
        config
      )
    ).not.toBeNull();
  });

  it('opponent stone blocks merge under 4-connectivity', () => {
    const { board, getCell, config } = grid([
      ['A', null, 'A'],
      [null, null, null],
    ]);
    board[0][1] = 'B';
    expect(countRegionsByValue(getCell, config).get('A')).toBe(2);
    expect(
      areConnected(
        { row: 0, col: 0 },
        { row: 0, col: 2 },
        getCell,
        config
      )
    ).toBe(false);
  });
});
