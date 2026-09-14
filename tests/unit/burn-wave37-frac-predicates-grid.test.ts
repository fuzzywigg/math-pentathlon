/**
 * Wave 37 — predicate table leftovers (proper/whole/zero/sign/simplified).
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createFraction,
  fromWhole,
  isProper,
  isWholeNumber,
  isZero,
  isPositive,
  isNegative,
  isSimplified,
  simplify,
  COMMON_FRACTIONS,
} from '../../src/core/fractions';

describe('Wave 37 frac-predicates — dense samples', () => {
  const samples = [
    ...COMMON_FRACTIONS,
    createFraction(0, 1),
    createFraction(0, 5),
    createFraction(4, 2),
    createFraction(9, 3),
    createFraction(-3, 7),
    createFraction(3, -7),
    { numerator: 2, denominator: 3, isNegative: true },
    fromWhole(5),
    fromWhole(-2),
  ];

  it('predicate consistency vs simplify', () => {
    for (const f of samples) {
      const s = simplify(f);
      expect(isSimplified(s)).toBe(true);
      expect(isZero(f)).toBe(s.numerator === 0);
      if (isZero(f)) {
        expect(isPositive(f)).toBe(false);
        expect(isNegative(f)).toBe(false);
      }
      if (isPositive(f)) expect(isNegative(f)).toBe(false);
      if (isNegative(f)) expect(isPositive(f)).toBe(false);
      expect(isWholeNumber(s)).toBe(s.denominator === 1 || s.numerator === 0);
      if (!isZero(f)) {
        expect(isProper(s)).toBe(s.numerator < s.denominator);
      }
    }
  });

  it('unsimplified fractions report isSimplified false when gcd>1', () => {
    expect(isSimplified(createFraction(2, 4))).toBe(false);
    expect(isSimplified(createFraction(6, 9))).toBe(false);
    expect(isSimplified(createFraction(7, 9))).toBe(true);
  });
});
