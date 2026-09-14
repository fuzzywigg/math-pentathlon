/**
 * Wave 42 — ALL_DIRECTIONS_8 / CARDINAL_DIRECTIONS vector inventory.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  ALL_DIRECTIONS,
  CARDINAL_DIRECTIONS,
  DIRECTION_VECTORS,
  getNeighbors,
} from '../../src/core/alignment';

describe('Wave 42 align-compat — all dirs8 inventory', () => {
  it('ALL_DIRECTIONS exposes exactly 8 named deltas', () => {
    expect(ALL_DIRECTIONS).toHaveLength(8);
    const names = ALL_DIRECTIONS.map((d) => d.name);
    expect(new Set(names).size).toBe(8);
    for (const d of ALL_DIRECTIONS) {
      expect(Math.abs(d.dRow) + Math.abs(d.dCol)).toBeGreaterThan(0);
      expect(Math.abs(d.dRow)).toBeLessThanOrEqual(1);
      expect(Math.abs(d.dCol)).toBeLessThanOrEqual(1);
    }
  });

  it('includes four reverse companions for core axes', () => {
    const names = new Set(ALL_DIRECTIONS.map((d) => d.name));
    for (const n of [
      'horizontal-rev',
      'vertical-rev',
      'diagonal-down-rev',
      'diagonal-up-rev',
    ]) {
      expect(names.has(n)).toBe(true);
    }
  });

  it('CARDINAL_DIRECTIONS is subset of 4 orthogonal steps', () => {
    expect(CARDINAL_DIRECTIONS).toHaveLength(4);
    for (const d of CARDINAL_DIRECTIONS) {
      expect(Math.abs(d.dRow) + Math.abs(d.dCol)).toBe(1);
    }
  });

  it('8-connect neighbors from center use all 8 dirs', () => {
    const n = getNeighbors({ row: 2, col: 2 }, { rows: 5, cols: 5 }, 8);
    expect(n).toHaveLength(8);
  });

  it('DIRECTION_VECTORS keys match semantic names', () => {
    expect(Object.keys(DIRECTION_VECTORS).sort()).toEqual(
      ['diagonal-down', 'diagonal-up', 'horizontal', 'vertical'].sort()
    );
  });
});
