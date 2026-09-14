/**
 * Wave 39 — compat isInBounds / normalizePosition wrap matrix leftovers.
 * Beyond classic alignment.test smoke. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { isInBounds, normalizePosition } from '../../src/core/alignment';

const dim = { rows: 4, cols: 5 };

describe('Wave 39 align — wrap matrix', () => {
  it('independent wrapHorizontal / wrapVertical axes', () => {
    expect(isInBounds({ row: -1, col: 2 }, dim)).toBe(false);
    expect(isInBounds({ row: -1, col: 2 }, dim, { wrapVertical: true })).toBe(
      true
    );
    expect(isInBounds({ row: 1, col: -1 }, dim, { wrapHorizontal: true })).toBe(
      true
    );
    expect(
      isInBounds({ row: -1, col: -1 }, dim, {
        wrapVertical: true,
        wrapHorizontal: true,
      })
    ).toBe(true);
    // only one axis wrapped still OOB on the other
    expect(
      isInBounds({ row: -1, col: -1 }, dim, { wrapVertical: true })
    ).toBe(false);
  });

  it('normalizePosition wraps both axes and leaves non-wrap unchanged', () => {
    expect(
      normalizePosition({ row: -1, col: 6 }, dim, {
        wrapVertical: true,
        wrapHorizontal: true,
      })
    ).toEqual({ row: 3, col: 1 });

    expect(normalizePosition({ row: -1, col: 6 }, dim)).toEqual({
      row: -1,
      col: 6,
    });
  });

  it('large negative wrap stays in range', () => {
    expect(
      normalizePosition({ row: -9, col: -11 }, dim, {
        wrapVertical: true,
        wrapHorizontal: true,
      })
    ).toEqual({ row: 3, col: 4 });
  });
});
