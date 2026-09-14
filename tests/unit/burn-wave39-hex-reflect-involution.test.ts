/**
 * Wave 39 — hex reflect involution / rotateAround wrap after #172/#173.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { reflect, rotateAround, hexEquals, createAxial } from '../../src/core/hex';

describe('Wave 39 hex — reflect involution', () => {
  it('reflect twice is identity for q|r|s', () => {
    const h = createAxial(3, -2);
    for (const axis of ['q', 'r', 's'] as const) {
      const once = reflect(h, axis);
      expect(hexEquals(reflect(once, axis), h)).toBe(true);
    }
  });

  it('rotateAround steps wrap including negative', () => {
    const center = createAxial(0, 0);
    const h = createAxial(2, 0);
    expect(hexEquals(rotateAround(h, center, 6), h)).toBe(true);
    expect(hexEquals(rotateAround(h, center, -6), h)).toBe(true);
    expect(
      hexEquals(rotateAround(h, center, 1), rotateAround(h, center, 7))
    ).toBe(true);
    expect(
      hexEquals(rotateAround(h, center, -1), rotateAround(h, center, 5))
    ).toBe(true);
  });
});
