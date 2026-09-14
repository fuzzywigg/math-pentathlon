/**
 * Wave 42 — Queens & Guards normalizePosition wrap leftovers after #186.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { normalizePosition, cellsInRing } from '../../src/games/queens-guards/types';

describe('Wave 42 queens — normalizePosition wrap', () => {
  it('center always normalizes to 0', () => {
    expect(normalizePosition(0, 5)).toBe(0);
    expect(normalizePosition(0, -3)).toBe(0);
  });

  it('ring 1 wraps negative and overflow positions', () => {
    expect(normalizePosition(1, -1)).toBe(5);
    expect(normalizePosition(1, 6)).toBe(0);
    expect(normalizePosition(1, 7)).toBe(1);
  });

  it('outer ring wraps large offsets modulo cell count', () => {
    const ring = 5;
    const count = cellsInRing(ring);
    expect(normalizePosition(ring, -1)).toBe(count - 1);
    expect(normalizePosition(ring, count)).toBe(0);
    expect(normalizePosition(ring, count + 3)).toBe(3);
  });
});
