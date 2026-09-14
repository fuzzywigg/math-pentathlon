/**
 * Wave 38 — countRegionsByValue / findRegionsForValue partition stress.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  countRegionsByValue,
  findAllRegions,
  findRegionsForValue,
  getLargestRegion,
} from '../../src/core/alignment/contiguous';
import { createArrayGetter } from '../../src/core/alignment/grid-alignment';
import type { ContiguousConfig, CellValue } from '../../src/core/alignment/types';

describe('Wave 38 contig-count — checkerboard and blobs', () => {
  it('checkerboard 1/0 has many size-1 regions per value', () => {
    const board: CellValue[][] = Array.from({ length: 6 }, (_, r) =>
      Array.from({ length: 6 }, (_, c) => ((r + c) % 2 === 0 ? 1 : 0) as CellValue)
    );
    const get = createArrayGetter(board);
    const cfg: ContiguousConfig = { rows: 6, cols: 6 };
    const counts = countRegionsByValue(get, cfg);
    expect(counts.get(1)).toBe(18);
    expect(counts.get(0)).toBe(18);
    expect(getLargestRegion(1, get, cfg)!.size).toBe(1);
  });

  it('8-connected checkerboard merges into two regions', () => {
    const board: CellValue[][] = Array.from({ length: 4 }, (_, r) =>
      Array.from({ length: 4 }, (_, c) => ((r + c) % 2 === 0 ? 'A' : 'B') as CellValue)
    );
    const get = createArrayGetter(board);
    const cfg: ContiguousConfig = {
      rows: 4,
      cols: 4,
      includeDiagonals: true,
    };
    const counts = countRegionsByValue(get, cfg);
    expect(counts.get('A')).toBe(1);
    expect(counts.get('B')).toBe(1);
    expect(findRegionsForValue('A', get, cfg)[0].size).toBe(8);
  });

  it('null cells are skipped; region sizes sum to non-null cells', () => {
    const board: CellValue[][] = [
      ['X', null, 'X', 'X'],
      [null, null, null, 'X'],
      ['Y', 'Y', null, null],
      [null, 'Y', 'Y', null],
    ];
    const get = createArrayGetter(board);
    const cfg: ContiguousConfig = { rows: 4, cols: 4 };
    const all = findAllRegions(get, cfg);
    const occupied = board.flat().filter((v) => v != null).length;
    expect(all.reduce((s, r) => s + r.size, 0)).toBe(occupied);
    expect(countRegionsByValue(get, cfg).get('X')).toBe(2);
    expect(countRegionsByValue(get, cfg).get('Y')).toBe(1);
  });
});
