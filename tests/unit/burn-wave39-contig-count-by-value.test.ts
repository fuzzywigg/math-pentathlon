/**
 * Wave 39 — countRegionsByValue multi-value leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { countRegionsByValue } from '../../src/core/alignment/contiguous';
import type { CellGetter, ContiguousConfig } from '../../src/core/alignment/types';

describe('Wave 39 contig — count by value', () => {
  it('empty board yields empty map', () => {
    const config: ContiguousConfig = { rows: 2, cols: 2 };
    const counts = countRegionsByValue(() => null, config);
    expect(counts.size).toBe(0);
  });

  it('counts separate regions per value', () => {
    const board = [
      ['A', 'A', 'B'],
      [null, null, 'B'],
      ['A', null, null],
    ];
    const config: ContiguousConfig = { rows: 3, cols: 3 };
    const get: CellGetter = (r, c) => board[r]?.[c] ?? null;
    const counts = countRegionsByValue(get, config);
    expect(counts.get('A')).toBe(2); // top pair + bottom singleton
    expect(counts.get('B')).toBe(1); // vertical pair
  });

  it('single filled cell is one region', () => {
    const board = [
      [null, null],
      [null, 'Q'],
    ];
    const config: ContiguousConfig = { rows: 2, cols: 2 };
    const get: CellGetter = (r, c) => board[r]?.[c] ?? null;
    const counts = countRegionsByValue(get, config);
    expect(counts.get('Q')).toBe(1);
    expect(counts.size).toBe(1);
  });
});
