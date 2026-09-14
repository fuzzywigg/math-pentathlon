/**
 * Overnight HEAVY leftover after #234 — findAlignmentsForValue with wrap:true.
 * Distinct from burn-wave40-align-for-value-dedupe (no wrap). Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  findAlignmentsForValue,
  DIRECTIONS,
} from '../../src/core/alignment';

describe('Wave 52 core align — for-value wrap', () => {
  it('1×4 with wrap finds horizontal length-3 for X across gap edge', () => {
    const row: Array<string | null> = ['X', null, 'X', 'X'];
    const get = (r: number, c: number) => (r === 0 ? row[c] ?? null : null);
    const found = findAlignmentsForValue('X', get, {
      rows: 1,
      cols: 4,
      targetLength: 3,
      wrap: true,
      directions: [DIRECTIONS.HORIZONTAL],
    });
    expect(found.length).toBeGreaterThanOrEqual(1);
    expect(found[0].positions.length).toBe(3);
  });
});
