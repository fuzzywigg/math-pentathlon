/**
 * Overnight HEAVY leftover after #234 — wrap targetLength > ring revisits coords.
 * Distinct from burn-wave38-align-wrap-toroidal win-length. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  findAlignmentInDirection,
  DIRECTIONS,
} from '../../src/core/alignment';

describe('Wave 52 core align — wrap overshoot dupes', () => {
  it('1×3 all X with wrap targetLength 5 → length 5 with repeated coords', () => {
    const row = ['X', 'X', 'X'];
    const get = (r: number, c: number) => (r === 0 ? row[c] ?? null : null);
    const result = findAlignmentInDirection(0, 0, DIRECTIONS.HORIZONTAL, get, {
      rows: 1,
      cols: 3,
      targetLength: 5,
      wrap: true,
    });
    expect(result).not.toBeNull();
    expect(result!.positions).toHaveLength(5);
    const keys = result!.positions.map((p) => `${p.row},${p.col}`);
    expect(new Set(keys).size).toBeLessThan(5);
  });
});
