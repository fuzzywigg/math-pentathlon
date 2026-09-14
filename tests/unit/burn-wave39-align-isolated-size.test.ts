/**
 * Wave 39 — isIsolated / getRegionSize 4- vs 8-connect leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { isIsolated, getRegionSize } from '../../src/core/alignment';

describe('Wave 39 align — isolated / region size', () => {
  const dims = { rows: 3, cols: 3 };

  it('null cell yields size 0 and not isolated region', () => {
    const get = () => null;
    expect(getRegionSize({ row: 1, col: 1 }, dims, get)).toBe(0);
    // findRegionAt returns null → size 0 → isIsolated treats as size===1? (0===1) false
    expect(isIsolated({ row: 1, col: 1 }, dims, get)).toBe(false);
  });

  it('singleton is isolated under 4-connect', () => {
    const board = [
      [null, null, null],
      [null, 'X', null],
      [null, null, null],
    ];
    const get = (r: number, c: number) => board[r]?.[c] ?? null;
    expect(getRegionSize({ row: 1, col: 1 }, dims, get)).toBe(1);
    expect(isIsolated({ row: 1, col: 1 }, dims, get)).toBe(true);
  });

  it('diagonal neighbor joins under 8-connect only', () => {
    const board = [
      ['X', null, null],
      [null, 'X', null],
      [null, null, null],
    ];
    const get = (r: number, c: number) => board[r]?.[c] ?? null;
    expect(isIsolated({ row: 0, col: 0 }, dims, get, { connectivity: 4 })).toBe(
      true
    );
    expect(isIsolated({ row: 0, col: 0 }, dims, get, { connectivity: 8 })).toBe(
      false
    );
    expect(getRegionSize({ row: 0, col: 0 }, dims, get)).toBe(1);
  });
});
