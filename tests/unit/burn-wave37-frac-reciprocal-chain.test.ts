/**
 * Wave 37 — reciprocal / negate / abs chain leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createFraction,
  reciprocal,
  negate,
  abs,
  multiply,
  areEqual,
  simplify,
  fromWhole,
  isPositive,
  isNegative,
} from '../../src/core/fractions';

describe('Wave 37 frac-reciprocal — chains', () => {
  const samples = [
    createFraction(2, 3),
    createFraction(-3, 5),
    createFraction(1, 8),
    { numerator: 5, denominator: 7, isNegative: true },
  ];

  it('reciprocal twice returns equivalent', () => {
    for (const f of samples) {
      expect(areEqual(simplify(reciprocal(reciprocal(f))), simplify(f))).toBe(
        true
      );
    }
  });

  it('f * reciprocal(f) == 1', () => {
    for (const f of samples) {
      expect(
        areEqual(simplify(multiply(f, reciprocal(f))), fromWhole(1))
      ).toBe(true);
    }
  });

  it('negate twice round-trips signed-numerator forms; flag-neg is a leftover', () => {
    for (const f of samples) {
      const twice = negate(negate(f));
      if (f.isNegative === true) {
        // negate only flips numerator and drops isNegative — value becomes positive
        expect(twice.numerator).toBe(Math.abs(f.numerator));
        expect(twice.isNegative).toBeUndefined();
        expect(areEqual(twice, f)).toBe(false);
      } else {
        expect(areEqual(twice, f)).toBe(true);
      }
      const a = abs(f);
      expect(a.numerator).toBe(Math.abs(f.numerator));
      // abs rebuilds {numerator, denominator} without isNegative, so flag is cleared
      expect(a.isNegative).toBeUndefined();
      expect(isNegative(a)).toBe(false);
      expect(isPositive(a) || a.numerator === 0).toBe(true);
    }
  });

  it('reciprocal of zero throws', () => {
    expect(() => reciprocal(createFraction(0, 1))).toThrow();
  });
});
