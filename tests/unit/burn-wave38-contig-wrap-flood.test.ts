/**
 * Wave 38 — contiguous wrap flood / toroidal region merge.
 * Beyond wave 25 non-wrap matrices. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  getNeighbors,
  findRegion,
  findAllRegions,
  areConnected,
  countRegionsByValue,
} from '../../src/core/alignment/contiguous';
import { createArrayGetter } from '../../src/core/alignment/grid-alignment';
import type { ContiguousConfig, CellValue } from '../../src/core/alignment/types';

describe('Wave 38 contig-wrap — neighbor wrap at edges', () => {
  it('corner with wrap has 4 neighbors that wrap', () => {
    const cfg: ContiguousConfig = { rows: 4, cols: 4, wrap: true };
    const n = getNeighbors(0, 0, cfg);
    expect(n).toHaveLength(4);
    const keys = n.map((p) => `${p.row},${p.col}`).sort();
    expect(keys).toEqual(['0,1', '0,3', '1,0', '3,0'].sort());
  });

  it('without wrap corner has 2 neighbors', () => {
    const cfg: ContiguousConfig = { rows: 4, cols: 4, wrap: false };
    expect(getNeighbors(0, 0, cfg)).toHaveLength(2);
  });
});

describe('Wave 38 contig-wrap — opposite-edge same value merges', () => {
  it('left-right edge cells connect via wrap into one region', () => {
    const board: CellValue[][] = [
      ['A', null, null, 'A'],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];
    const get = createArrayGetter(board);
    const cfg: ContiguousConfig = { rows: 4, cols: 4, wrap: true };
    const region = findRegion(0, 0, get, cfg)!;
    expect(region.size).toBe(2);
    expect(areConnected({ row: 0, col: 0 }, { row: 0, col: 3 }, get, cfg)).toBe(
      true
    );

    const noWrap: ContiguousConfig = { rows: 4, cols: 4, wrap: false };
    expect(findRegion(0, 0, get, noWrap)!.size).toBe(1);
    expect(
      areConnected({ row: 0, col: 0 }, { row: 0, col: 3 }, get, noWrap)
    ).toBe(false);
  });
});

describe('Wave 38 contig-wrap — full wrap torus of A is one region', () => {
  it('4×4 all A with wrap → single region size 16', () => {
    const board: CellValue[][] = Array.from({ length: 4 }, () =>
      Array.from({ length: 4 }, () => 'A' as CellValue)
    );
    const get = createArrayGetter(board);
    const cfg: ContiguousConfig = { rows: 4, cols: 4, wrap: true };
    const regions = findAllRegions(get, cfg);
    expect(regions).toHaveLength(1);
    expect(regions[0].size).toBe(16);
    const counts = countRegionsByValue(get, cfg);
    expect(counts.get('A')).toBe(1);
  });
});
