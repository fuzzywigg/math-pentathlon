/**
 * Wave 38 — hex-neighbor region edge-touch / connect matrix.
 * Beyond wave 25 contig-hex-win smoke. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  getHexNeighbors,
  findRegion,
  findAllRegions,
  regionTouchesEdge,
  regionConnectsEdges,
  getLargestRegion,
} from '../../src/core/alignment/contiguous';
import { createArrayGetter } from '../../src/core/alignment/grid-alignment';
import type { ContiguousConfig, CellValue } from '../../src/core/alignment/types';

describe('Wave 38 contig-hex — neighbor counts by parity', () => {
  it('interior even/odd rows have 6 neighbors; corners fewer', () => {
    const cfg: ContiguousConfig = { rows: 6, cols: 6 };
    expect(getHexNeighbors(2, 2, cfg)).toHaveLength(6);
    expect(getHexNeighbors(3, 2, cfg)).toHaveLength(6);
    expect(getHexNeighbors(0, 0, cfg).length).toBeLessThan(6);
    expect(getHexNeighbors(5, 5, cfg).length).toBeLessThan(6);
  });

  it('wrap gives full 6 even at corners', () => {
    const cfg: ContiguousConfig = { rows: 6, cols: 6, wrap: true };
    expect(getHexNeighbors(0, 0, cfg)).toHaveLength(6);
    expect(getHexNeighbors(5, 5, cfg)).toHaveLength(6);
  });
});

describe('Wave 38 contig-hex — left-right connect for Hex-style win', () => {
  it('horizontal corridor with hex neighbors connects L-R', () => {
    const board: CellValue[][] = Array.from({ length: 5 }, () =>
      Array.from({ length: 5 }, () => null as CellValue)
    );
    // paint a path of 'B' across row 2
    for (let c = 0; c < 5; c++) board[2][c] = 'B';
    const get = createArrayGetter(board);
    const cfg: ContiguousConfig = { rows: 5, cols: 5 };
    const region = findRegion(2, 0, get, cfg, getHexNeighbors)!;
    expect(region.size).toBe(5);
    expect(regionTouchesEdge(region, 'left', cfg)).toBe(true);
    expect(regionTouchesEdge(region, 'right', cfg)).toBe(true);
    expect(regionConnectsEdges(region, 'left', 'right', cfg)).toBe(true);
    expect(regionConnectsEdges(region, 'top', 'bottom', cfg)).toBe(false);
  });

  it('largest region among mixed values uses hex adjacency', () => {
    const board: CellValue[][] = [
      ['R', 'R', null, 'B', null],
      ['R', null, null, 'B', 'B'],
      [null, null, null, null, 'B'],
      ['G', 'G', 'G', 'G', null],
      [null, null, null, null, null],
    ];
    const get = createArrayGetter(board);
    const cfg: ContiguousConfig = { rows: 5, cols: 5 };
    const largestG = getLargestRegion('G', get, cfg, getHexNeighbors)!;
    expect(largestG.size).toBe(4);
    const all = findAllRegions(get, cfg, getHexNeighbors);
    expect(all.length).toBeGreaterThanOrEqual(3);
  });
});
