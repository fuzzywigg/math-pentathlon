/**
 * Overnight HEAVY leftover after #234 — findRegion on null cell → null; areConnected false.
 * Distinct from burn-wave39-align-region-stats-empty. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { findRegion, areConnected } from '../../src/core/alignment/contiguous';

describe('Wave 52 core align — region null start', () => {
  it('null start cell yields null region and disconnected', () => {
    const grid: Array<Array<string | null>> = [
      [null, 'X'],
      ['X', 'X'],
    ];
    const get = (r: number, c: number) => grid[r]?.[c] ?? null;
    const cfg = { rows: 2, cols: 2 };
    expect(findRegion(0, 0, get, cfg)).toBeNull();
    expect(
      areConnected({ row: 0, col: 0 }, { row: 1, col: 1 }, get, cfg)
    ).toBe(false);
  });
});
