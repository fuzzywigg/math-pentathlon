/**
 * Wave 39 — getLargestRegion / findRegionsForValue miss leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  getLargestRegion,
  findRegionsForValue,
} from '../../src/core/alignment/contiguous';
import type { CellGetter, ContiguousConfig } from '../../src/core/alignment/types';

describe('Wave 39 contig — largest / miss value', () => {
  const config: ContiguousConfig = { rows: 3, cols: 3 };

  it('missing value returns empty / null', () => {
    const board = [
      ['A', null, null],
      [null, null, null],
      [null, null, null],
    ];
    const get: CellGetter = (r, c) => board[r]?.[c] ?? null;
    expect(findRegionsForValue('Z', get, config)).toEqual([]);
    expect(getLargestRegion('Z', get, config)).toBeNull();
  });

  it('largest picks bigger of two same-value regions', () => {
    const board = [
      ['A', 'A', null],
      [null, null, 'A'],
      [null, null, 'A'],
    ];
    const get: CellGetter = (r, c) => board[r]?.[c] ?? null;
    const regions = findRegionsForValue('A', get, config);
    expect(regions).toHaveLength(2);
    const largest = getLargestRegion('A', get, config)!;
    expect(largest.size).toBe(2);
  });

  it('empty board largest is null', () => {
    expect(getLargestRegion('A', () => null, config)).toBeNull();
  });
});
