/**
 * Wave 42 — normalizePosition / isInBounds torus wrap leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { normalizePosition, isInBounds } from '../../src/core/alignment';

const dim = { rows: 5, cols: 7 };

describe('Wave 42 align-compat — normalize torus', () => {
  it('wrapVertical maps row past bottom to top', () => {
    expect(
      normalizePosition({ row: 5, col: 2 }, dim, { wrapVertical: true })
    ).toEqual({ row: 0, col: 2 });
  });

  it('wrapHorizontal maps col past right to left', () => {
    expect(
      normalizePosition({ row: 1, col: 7 }, dim, { wrapHorizontal: true })
    ).toEqual({ row: 1, col: 0 });
  });

  it('full torus wraps both axes from negatives', () => {
    expect(
      normalizePosition(
        { row: -1, col: -1 },
        dim,
        { wrapVertical: true, wrapHorizontal: true }
      )
    ).toEqual({ row: 4, col: 6 });
  });

  it('without wrap, OOB stays OOB for isInBounds', () => {
    expect(isInBounds({ row: -1, col: 0 }, dim)).toBe(false);
    expect(isInBounds({ row: 0, col: 7 }, dim)).toBe(false);
  });

  it('torus wrap makes far OOB appear in-bounds', () => {
    expect(
      isInBounds(
        { row: 12, col: 15 },
        dim,
        { wrapVertical: true, wrapHorizontal: true }
      )
    ).toBe(true);
  });
});
