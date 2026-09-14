/**
 * Overnight HEAVY leftover after #234 — wrapPosition with zero rows/cols → NaN.
 * Distinct from burn-wave24-grid-bounds-wrap. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { wrapPosition } from '../../src/core/alignment';

describe('Wave 52 core align — wrap zero dims', () => {
  it('rows=0 or cols=0 yields NaN components', () => {
    const a = wrapPosition(1, 1, 0, 5);
    expect(Number.isNaN(a.row)).toBe(true);
    expect(a.col).toBe(1);
    const b = wrapPosition(1, 1, 5, 0);
    expect(b.row).toBe(1);
    expect(Number.isNaN(b.col)).toBe(true);
  });
});
