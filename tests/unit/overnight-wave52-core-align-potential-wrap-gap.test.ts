/**
 * Overnight HEAVY leftover after #234 — countAlignmentPotential wrap with single null gap.
 * Distinct from burn-wave24-align-potential wrap arm count. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  countAlignmentPotential,
  DIRECTIONS,
} from '../../src/core/alignment';

describe('Wave 52 core align — potential wrap gap', () => {
  it('wrapped row with one null stays finite and unblocked on open arm', () => {
    const row: Array<string | null> = ['X', 'X', null, 'X'];
    const get = (r: number, c: number) => (r === 0 ? row[c] ?? null : null);
    const map = countAlignmentPotential(0, 0, 'X', get, {
      rows: 1,
      cols: 4,
      targetLength: 3,
      wrap: true,
      directions: [DIRECTIONS.HORIZONTAL],
    });
    const h = map.get('horizontal')!;
    expect(Number.isFinite(h.count)).toBe(true);
    expect(h.count).toBeGreaterThanOrEqual(2);
    expect(h.blocked).toBe(false);
  });
});
