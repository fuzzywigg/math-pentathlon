/**
 * Wave 25 — contiguous ortho neighbors / wrap flood / areConnected / diagonals.
 * Distinct from wave 21 hex-region edges and wave 24 grid-alignment N-in-a-row.
 * Imports contiguous.ts directly. Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  getNeighbors,
  findRegion,
  findAllRegions,
  areConnected,
  findPath,
  countRegionsByValue,
  getLargestRegion,
  type ContiguousConfig,
  type CellGetter,
  type CellValue,
} from '../../src/core/alignment/contiguous';

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

describe('Wave 25 contiguous — getNeighbors 4/8 + wrap', () => {
  it('center has 4 ortho neighbors; diagonals add corner offsets', () => {
    const config: ContiguousConfig = { rows: 5, cols: 5 };
    const four = getNeighbors(2, 2, config);
    expect(four).toHaveLength(4);
    expect(four.map((p) => `${p.row},${p.col}`).sort()).toEqual([
      '1,2',
      '2,1',
      '2,3',
      '3,2',
    ]);

    const eight = getNeighbors(2, 2, { ...config, includeDiagonals: true });
    expect(eight).toHaveLength(8);
    expect(eight.map((p) => `${p.row},${p.col}`).sort()).toContain('1,1');
    expect(eight.map((p) => `${p.row},${p.col}`).sort()).toContain('3,3');
  });

  it('corners clip without wrap; wrap reconnects opposite edges', () => {
    const bare: ContiguousConfig = { rows: 3, cols: 3 };
    expect(getNeighbors(0, 0, bare)).toHaveLength(2);
    expect(
      getNeighbors(0, 0, { ...bare, includeDiagonals: true })
    ).toHaveLength(3);

    const wrapped = getNeighbors(0, 0, { ...bare, wrap: true });
    const keys = wrapped.map((p) => `${p.row},${p.col}`).sort();
    expect(keys).toContain('0,1');
    expect(keys).toContain('1,0');
    expect(keys).toContain('0,2'); // wrap left → right
    expect(keys).toContain('2,0'); // wrap up → bottom
    expect(wrapped).toHaveLength(4);
  });
});

describe('Wave 25 contiguous — flood fill ortho vs diagonal', () => {
  it('4-way keeps diagonal-only islands separate; 8-way merges them', () => {
    // X . X
    // . X .
    // X . X
    const { getCell, config } = grid([
      ['X', null, 'X'],
      [null, 'X', null],
      ['X', null, 'X'],
    ]);

    const ortho = findAllRegions(getCell, config);
    expect(ortho.filter((r) => r.value === 'X')).toHaveLength(5);

    const diag = findAllRegions(getCell, {
      ...config,
      includeDiagonals: true,
    });
    expect(diag.filter((r) => r.value === 'X')).toHaveLength(1);
    expect(diag.find((r) => r.value === 'X')?.size).toBe(5);
  });

  it('findRegion returns null on empty; wrap flood joins edge cells', () => {
    const { getCell, config } = grid([
      ['A', null, 'A'],
      [null, null, null],
      ['A', null, 'A'],
    ]);
    expect(findRegion(0, 1, getCell, config)).toBeNull();

    const wrapped = findRegion(0, 0, getCell, { ...config, wrap: true });
    expect(wrapped?.size).toBe(4);
    expect(
      areConnected({ row: 0, col: 0 }, { row: 2, col: 2 }, getCell, {
        ...config,
        wrap: true,
      })
    ).toBe(true);
    expect(
      areConnected({ row: 0, col: 0 }, { row: 2, col: 2 }, getCell, config)
    ).toBe(false);
  });

  it('areConnected false for empty start or different values', () => {
    const { getCell, config } = grid([
      ['A', 'A', null],
      ['B', 'B', 'B'],
    ]);
    expect(
      areConnected({ row: 0, col: 2 }, { row: 0, col: 0 }, getCell, config)
    ).toBe(false);
    expect(
      areConnected({ row: 0, col: 0 }, { row: 1, col: 0 }, getCell, config)
    ).toBe(false);
    expect(
      areConnected({ row: 1, col: 0 }, { row: 1, col: 2 }, getCell, config)
    ).toBe(true);
  });
});

describe('Wave 25 contiguous — path / counts / largest', () => {
  it('findPath returns shortest BFS path or null across gaps', () => {
    const { getCell, config } = grid([
      ['A', 'A', 'A'],
      [null, null, 'A'],
      ['A', 'A', 'A'],
    ]);
    const path = findPath(
      { row: 0, col: 0 },
      { row: 2, col: 0 },
      getCell,
      config
    );
    expect(path).not.toBeNull();
    expect(path![0]).toEqual({ row: 0, col: 0 });
    expect(path![path!.length - 1]).toEqual({ row: 2, col: 0 });
    expect(path!.length).toBeGreaterThanOrEqual(5);

    expect(
      findPath({ row: 0, col: 0 }, { row: 2, col: 0 }, getCell, {
        ...config,
        rows: 2,
        cols: 2,
      })
    ).toBeNull();
  });

  it('countRegionsByValue and getLargestRegion across multi-value board', () => {
    const { getCell, config } = grid([
      ['R', 'R', 'B'],
      ['R', null, 'B'],
      ['G', 'G', 'G'],
    ]);
    const counts = countRegionsByValue(getCell, config);
    expect(counts.get('R')).toBe(1);
    expect(counts.get('B')).toBe(1);
    expect(counts.get('G')).toBe(1);

    expect(getLargestRegion('R', getCell, config)?.size).toBe(3);
    expect(getLargestRegion('B', getCell, config)?.size).toBe(2);
    expect(getLargestRegion('Z', getCell, config)).toBeNull();

    // Split R into two with a gap
    const split = grid([
      ['R', null, 'R'],
      [null, null, null],
    ]);
    expect(countRegionsByValue(split.getCell, split.config).get('R')).toBe(2);
    expect(getLargestRegion('R', split.getCell, split.config)?.size).toBe(1);
  });
});
