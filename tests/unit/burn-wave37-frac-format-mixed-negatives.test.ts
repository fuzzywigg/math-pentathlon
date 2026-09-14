/**
 * Wave 37 — formatMixedNumber negative leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createFraction,
  formatMixedNumber,
  toMixedNumber,
} from '../../src/core/fractions';

describe('Wave 37 frac-format-mixed-neg — shapes', () => {
  it('formats negative impropers with signed whole', () => {
    const f = createFraction(-5, 2);
    const mixed = toMixedNumber(f);
    expect(mixed.whole).toBe(-2);
    expect(mixed.fraction.numerator).toBe(1);
    expect(formatMixedNumber(f)).toBe('-2 1/2');
  });

  it('proper negatives lose sign in formatMixedNumber when whole=0 (leftover)', () => {
    // toMixedNumber uses abs remainder; whole=0 → formatFraction(positive)
    expect(formatMixedNumber(createFraction(-1, 3))).toBe('1/3');
    expect(toMixedNumber(createFraction(-1, 3))).toEqual({
      whole: -0, // trunc toward zero of -1/3
      fraction: { numerator: 1, denominator: 3 },
    });
  });

  it('negative wholes with zero remainder', () => {
    expect(formatMixedNumber(createFraction(-6, 3))).toBe('-2');
  });
});
