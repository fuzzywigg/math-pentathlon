/**
 * Wave 24 — contiguous core (flood-fill / hex neighbors / edge connect / path).
 * Imports contiguous.ts directly (not compat wrappers covered by alignment.test.ts).
 * Distinct from wave 22 highlight-ui and wave 21 hex-region game edges.
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
import type { CellGetter, ContiguousConfig } from '../../src/core/alignment/types';

function getter(board: (string | number | null)[][]): CellGetter {
  return (r, c) => {
    if (r < 0 || c < 0 || r >= board.length || c >= (board[r]?.length ?? 0)) {
      return null;
    }
    return board[r][c];
  };
}

describe('Wave 24 contiguous — neighbor topology', () => {
  const cfg: ContiguousConfig = { rows: 3, cols: 3 };

  it('4-way center has 4; corner has 2; 8-way center has 8', () => {
    expect(getNeighbors(1, 1, cfg)).toHaveLength(4);
    expect(getNeighbors(0, 0, cfg)).toHaveLength(2);
    expect(
      getNeighbors(1, 1, { ...cfg, includeDiagonals: true })
    ).toHaveLength(8);
  });

  it('wrap connects opposite edges for 4-way', () => {
    const wrapped = getNeighbors(0, 0, { ...cfg, wrap: true });
    expect(wrapped).toEqual(
      expect.arrayContaining([
        { row: 2, col: 0 },
        { row: 0, col: 2 },
        { row: 1, col: 0 },
        { row: 0, col: 1 },
      ])
    );
    expect(wrapped).toHaveLength(4);
  });

  it('hex neighbors differ for even vs odd rows; wrap stays in bounds', () => {
    const even = getHexNeighbors(0, 1, cfg);
    const odd = getHexNeighbors(1, 1, cfg);
    expect(even).not.toEqual(odd);
    expect(even.every((p) => p.row >= 0 && p.row < 3 && p.col >= 0 && p.col < 3)).toBe(
      true
    );
    const wrapped = getHexNeighbors(0, 0, { ...cfg, wrap: true });
    expect(wrapped).toHaveLength(6);
    expect(
      wrapped.every((p) => p.row >= 0 && p.row < 3 && p.col >= 0 && p.col < 3)
    ).toBe(true);
  });
});

describe('Wave 24 contiguous — regions / path / edges', () => {
  const board = [
    ['A', 'A', null, 'B'],
    ['A', null, 'B', 'B'],
    [null, 'C', 'C', 'C'],
    ['D', null, null, 'A'],
  ];
  const get = getter(board);
  const cfg: ContiguousConfig = { rows: 4, cols: 4 };

  it('findRegion null on empty; floods matching value', () => {
    expect(findRegion(0, 2, get, cfg)).toBeNull();
    const a = findRegion(0, 0, get, cfg);
    expect(a?.value).toBe('A');
    expect(a?.size).toBe(3);
    expect(a?.positions).toEqual(
      expect.arrayContaining([
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 1, col: 0 },
      ])
    );
  });

  it('findAllRegions / forValue / largest / countByValue', () => {
    const all = findAllRegions(get, cfg);
    expect(all.length).toBeGreaterThanOrEqual(5);
    expect(findRegionsForValue('B', get, cfg)).toHaveLength(1);
    expect(findRegionsForValue('A', get, cfg)).toHaveLength(2);
    expect(getLargestRegion('A', get, cfg)?.size).toBe(3);
    expect(getLargestRegion('Z', get, cfg)).toBeNull();

    const counts = countRegionsByValue(get, cfg);
    expect(counts.get('A')).toBe(2);
    expect(counts.get('B')).toBe(1);
    expect(counts.get('C')).toBe(1);
    expect(counts.get('D')).toBe(1);
  });

  it('areConnected / findPath within region; mismatch returns null', () => {
    expect(areConnected({ row: 0, col: 0 }, { row: 1, col: 0 }, get, cfg)).toBe(
      true
    );
    expect(areConnected({ row: 0, col: 0 }, { row: 3, col: 3 }, get, cfg)).toBe(
      false
    );
    expect(areConnected({ row: 0, col: 2 }, { row: 0, col: 3 }, get, cfg)).toBe(
      false
    );

    const path = findPath({ row: 0, col: 3 }, { row: 1, col: 2 }, get, cfg);
    expect(path).not.toBeNull();
    expect(path![0]).toEqual({ row: 0, col: 3 });
    expect(path!.at(-1)).toEqual({ row: 1, col: 2 });
    expect(findPath({ row: 0, col: 0 }, { row: 0, col: 3 }, get, cfg)).toBeNull();
    expect(findPath({ row: 0, col: 2 }, { row: 0, col: 3 }, get, cfg)).toBeNull();
  });

  it('regionTouchesEdge and regionConnectsEdges for Hex-style spans', () => {
    const bridgeBoard = [
      ['X', null, null],
      ['X', 'X', null],
      [null, 'X', 'X'],
    ];
    const g = getter(bridgeBoard);
    const c: ContiguousConfig = { rows: 3, cols: 3 };
    const region = findRegion(0, 0, g, c)!;
    expect(regionTouchesEdge(region, 'top', c)).toBe(true);
    expect(regionTouchesEdge(region, 'left', c)).toBe(true);
    expect(regionTouchesEdge(region, 'right', c)).toBe(true);
    expect(regionTouchesEdge(region, 'bottom', c)).toBe(true);
    expect(regionConnectsEdges(region, 'top', 'bottom', c)).toBe(true);
    expect(regionConnectsEdges(region, 'left', 'right', c)).toBe(true);

    const island = findRegion(0, 0, getter([['Y', null], [null, null]]), {
      rows: 2,
      cols: 2,
    })!;
    expect(regionTouchesEdge(island, 'bottom', { rows: 2, cols: 2 })).toBe(
      false
    );
    expect(
      regionConnectsEdges(island, 'top', 'bottom', { rows: 2, cols: 2 })
    ).toBe(false);
  });

  it('8-way diagonals merge regions that 4-way keeps separate', () => {
    const diag = [
      ['Z', null],
      [null, 'Z'],
    ];
    const g = getter(diag);
    const four = findAllRegions(g, { rows: 2, cols: 2 });
    expect(four).toHaveLength(2);
    const eight = findAllRegions(g, { rows: 2, cols: 2, includeDiagonals: true });
    expect(eight).toHaveLength(1);
    expect(eight[0].size).toBe(2);
  });
});
