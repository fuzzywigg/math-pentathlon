/**
 * Wave 38 — getLargestRegion / findRegionsForValue multi-blob stress.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  getLargestRegion,
  findRegionsForValue,
  findAllRegions,
  regionTouchesEdge,
} from '../../src/core/alignment/contiguous';
import { createArrayGetter } from '../../src/core/alignment/grid-alignment';
import type { ContiguousConfig, CellValue } from '../../src/core/alignment/types';

describe('Wave 38 contig-largest — scattered blobs', () => {
  it('picks the biggest island among several X regions', () => {
    const board: CellValue[][] = [
      ['X', 'X', null, 'X', null, null],
      ['X', null, null, null, null, 'Y'],
      [null, null, 'X', 'X', 'X', 'Y'],
      [null, null, 'X', 'X', 'X', null],
      ['Y', 'Y', null, null, null, null],
      [null, null, null, 'X', null, null],
    ];
    const get = createArrayGetter(board);
    const cfg: ContiguousConfig = { rows: 6, cols: 6 };
    const largestX = getLargestRegion('X', get, cfg)!;
    expect(largestX.size).toBe(6); // 2x3 block
    const xRegions = findRegionsForValue('X', get, cfg);
    expect(xRegions.length).toBe(4); // 3-cell, 1-cell, 6-cell, 1-cell
    expect(Math.max(...xRegions.map((r) => r.size))).toBe(6);

    const largestY = getLargestRegion('Y', get, cfg)!;
    expect(largestY.size).toBe(2);
    expect(getLargestRegion('Z', get, cfg)).toBeNull();
  });

  it('edge-touching largest region detected', () => {
    const board: CellValue[][] = [
      ['B', 'B', 'B'],
      [null, null, null],
      ['B', null, 'B'],
    ];
    const get = createArrayGetter(board);
    const cfg: ContiguousConfig = { rows: 3, cols: 3 };
    const top = getLargestRegion('B', get, cfg)!;
    expect(top.size).toBe(3);
    expect(regionTouchesEdge(top, 'top', cfg)).toBe(true);
    expect(regionTouchesEdge(top, 'bottom', cfg)).toBe(false);
    expect(findAllRegions(get, cfg)).toHaveLength(3);
  });
});
