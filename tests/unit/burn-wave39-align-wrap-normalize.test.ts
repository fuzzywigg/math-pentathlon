/**
 * Wave 39 — normalizePosition / isInBounds wrap leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { normalizePosition, isInBounds } from '../../src/core/alignment';

describe('Wave 39 align — wrap normalize', () => {
  const dims = { rows: 5, cols: 4 };

  it('without wrap leaves negative coords unchanged', () => {
    expect(normalizePosition({ row: -1, col: -2 }, dims)).toEqual({
      row: -1,
      col: -2,
    });
    expect(isInBounds({ row: -1, col: 0 }, dims)).toBe(false);
  });

  it('wrapVertical maps negative row into range', () => {
    expect(
      normalizePosition({ row: -1, col: 1 }, dims, { wrapVertical: true })
    ).toEqual({ row: 4, col: 1 });
    expect(
      isInBounds({ row: -1, col: 1 }, dims, { wrapVertical: true })
    ).toBe(true);
  });

  it('wrapHorizontal maps negative col into range', () => {
    expect(
      normalizePosition({ row: 0, col: -1 }, dims, { wrapHorizontal: true })
    ).toEqual({ row: 0, col: 3 });
    expect(
      isInBounds({ row: 0, col: -1 }, dims, { wrapHorizontal: true })
    ).toBe(true);
  });

  it('both wraps on large positive overflow', () => {
    expect(
      normalizePosition(
        { row: 7, col: 6 },
        dims,
        { wrapVertical: true, wrapHorizontal: true }
      )
    ).toEqual({ row: 2, col: 2 });
  });
});
