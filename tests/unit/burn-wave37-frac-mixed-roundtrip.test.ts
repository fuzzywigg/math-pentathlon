/**
 * Wave 37 — toMixedNumber / fromMixedNumber round-trip leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createFraction,
  toMixedNumber,
  fromMixedNumber,
  areEqual,
  simplify,
  formatMixedNumber,
  parseFraction,
} from '../../src/core/fractions';

describe('Wave 37 frac-mixed — round trips', () => {
  const samples = [
    createFraction(1, 2),
    createFraction(5, 2),
    createFraction(11, 3),
    createFraction(-7, 4),
    createFraction(9, 3),
    createFraction(0, 5),
    createFraction(13, 8),
  ];

  it('fromMixedNumber(toMixedNumber(f)) equals f', () => {
    for (const f of samples) {
      const m = toMixedNumber(f);
      const back = fromMixedNumber(m.whole, m.fraction.numerator, m.fraction.denominator);
      expect(areEqual(simplify(back), simplify(f))).toBe(true);
    }
  });

  it('formatMixedNumber parses for non-negative impropers', () => {
    for (const f of [
      createFraction(5, 2),
      createFraction(11, 4),
      createFraction(3, 4),
      createFraction(6, 2),
    ]) {
      const s = formatMixedNumber(f);
      const parsed = parseFraction(s);
      expect(parsed).not.toBeNull();
      expect(areEqual(simplify(parsed!), simplify(f))).toBe(true);
    }
  });
});
