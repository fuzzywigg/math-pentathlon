/**
 * Overnight HEAVY leftover after #250 — normalizePosition wrap on both axes.
 * Distinct from wave52 wrap-zero and compat isInBounds wrap. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { normalizePosition, isInBounds } from '../../src/core/alignment';

describe('Wave 55 core align — normalize wrap both', () => {
  it('negative and oversized coords wrap independently per axis', () => {
    const dim = { rows: 4, cols: 5 };
    expect(
      normalizePosition(
        { row: -1, col: 7 },
        dim,
        { wrapVertical: true, wrapHorizontal: true }
      )
    ).toEqual({ row: 3, col: 2 });
    expect(
      isInBounds({ row: -1, col: 7 }, dim, {
        wrapVertical: true,
        wrapHorizontal: true,
      })
    ).toBe(true);
    expect(normalizePosition({ row: -1, col: 7 }, dim)).toEqual({
      row: -1,
      col: 7,
    });
  });
});
