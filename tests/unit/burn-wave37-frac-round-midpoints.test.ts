/**
 * Wave 37 — roundToDenominator midpoint leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createFraction,
  roundToDenominator,
  fromDecimal,
} from '../../src/core/fractions';

describe('Wave 37 frac-round-mid — Math.round ties', () => {
  it('half-up style via Math.round for .5 cases', () => {
    // 0.5 → round to denom 1 → 1
    expect(roundToDenominator(createFraction(1, 2), 1)).toEqual({
      numerator: 1,
      denominator: 1,
    });
    // 1.5 → 2
    expect(roundToDenominator(createFraction(3, 2), 1)).toEqual({
      numerator: 2,
      denominator: 1,
    });
    // -0.5 → Math.round(-0.5) === -0 in some engines / -0
    const neg = roundToDenominator(createFraction(-1, 2), 1);
    expect(neg.denominator).toBe(1);
    expect(Math.abs(neg.numerator)).toBe(0);
  });

  it('rounding to 10ths from tenths decimals', () => {
    for (let i = 0; i <= 20; i++) {
      const v = fromDecimal(i / 20, 100);
      const r = roundToDenominator(v, 10);
      expect(r.denominator).toBe(10);
      expect(r.numerator).toBeGreaterThanOrEqual(0);
      expect(r.numerator).toBeLessThanOrEqual(10);
    }
  });
});
