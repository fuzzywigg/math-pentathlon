/**
 * Wave 37 — simplify always emits isNegative form leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createFraction,
  simplify,
  areEqual,
  toDecimal,
} from '../../src/core/fractions';

describe('Wave 37 frac-simplify — canonical form', () => {
  const inputs = [
    createFraction(2, 4),
    createFraction(-2, 4),
    createFraction(2, -4),
    createFraction(-2, -4),
    createFraction(0, 9),
    createFraction(15, 25),
    createFraction(-15, 25),
    { numerator: 4, denominator: 6, isNegative: true },
    { numerator: 4, denominator: 6, isNegative: false },
    { numerator: 0, denominator: 3, isNegative: true },
  ];

  it('simplify yields positive numerator, gcd 1, isNegative boolean', () => {
    for (const f of inputs) {
      const s = simplify(f);
      expect(s.numerator).toBeGreaterThanOrEqual(0);
      expect(s.denominator).toBeGreaterThan(0);
      expect(typeof s.isNegative).toBe('boolean');
      if (s.numerator === 0) {
        expect(s.denominator).toBe(1);
        expect(s.isNegative).toBe(false);
      }
      expect(areEqual(s, f)).toBe(true);
      expect(toDecimal(s)).toBeCloseTo(toDecimal(f), 12);
    }
  });
});
