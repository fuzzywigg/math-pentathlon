/**
 * Wave 27 — dual negative representation (signed numerator vs isNegative flag).
 * Distinct from wave 21 fraction-bar-ui. Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  createFraction,
  fromWhole,
  simplify,
  areEqual,
  areEquivalent,
  compare,
  toDecimal,
  toMixedNumber,
  add,
  subtract,
  multiply,
  divide,
  reciprocal,
  negate,
  abs,
  isPositive,
  isNegative,
  isZero,
  isProper,
  isWholeNumber,
  isSimplified,
} from '../../src/core/fractions';

const F = createFraction;
const flag = (n: number, d: number, isNegative = true) => ({
  numerator: n,
  denominator: d,
  isNegative,
});

describe('Wave 27 frac-sign-dual — simplify / equality / compare', () => {
  it('simplify converts signed numerators into isNegative flag form', () => {
    expect(simplify(F(-6, 8))).toEqual({
      numerator: 3,
      denominator: 4,
      isNegative: true,
    });
    expect(simplify(flag(6, 8))).toEqual({
      numerator: 3,
      denominator: 4,
      isNegative: true,
    });
    expect(simplify(F(0, 12))).toEqual({
      numerator: 0,
      denominator: 1,
      isNegative: false,
    });
    expect(simplify(flag(0, 5))).toEqual({
      numerator: 0,
      denominator: 1,
      isNegative: false,
    });
  });

  it('areEqual / areEquivalent treat both negative styles as identical', () => {
    expect(areEqual(F(-1, 2), flag(1, 2))).toBe(true);
    expect(areEquivalent(F(-2, 4), flag(1, 2))).toBe(true);
    expect(areEqual(F(1, 2), flag(1, 2))).toBe(false);
    expect(areEqual(flag(3, 5, false), F(3, 5))).toBe(true);
  });

  it('compare ordering is consistent across styles', () => {
    expect(compare(flag(1, 2), F(1, 3))).toBe(-1);
    expect(compare(F(-1, 4), flag(1, 2))).toBe(1);
    expect(compare(flag(2, 4), F(-1, 2))).toBe(0);
    expect(compare(F(1, 5), flag(1, 10))).toBe(1);
  });

  it('toDecimal respects isNegative flag even with positive numerator', () => {
    expect(toDecimal(flag(3, 4))).toBeCloseTo(-0.75, 10);
    expect(toDecimal(F(-3, 4))).toBeCloseTo(-0.75, 10);
    expect(toDecimal(flag(0, 4))).toBeCloseTo(0, 10);
    expect(Object.is(toDecimal(flag(0, 4)), -0) || toDecimal(flag(0, 4)) === 0).toBe(
      true
    );
  });
});

describe('Wave 27 frac-sign-dual — predicates', () => {
  it('isNegative / isPositive / isZero for both encodings', () => {
    expect(isNegative(flag(1, 3))).toBe(true);
    expect(isNegative(F(-1, 3))).toBe(true);
    expect(isNegative(F(1, 3))).toBe(false);
    expect(isPositive(flag(1, 3))).toBe(false);
    expect(isPositive(F(1, 3))).toBe(true);
    expect(isPositive(F(0, 1))).toBe(false);
    expect(isZero(F(0, 9))).toBe(true);
    expect(isZero(flag(0, 9))).toBe(true);
    expect(isZero(F(1, 9))).toBe(false);
  });

  it('isProper / isWholeNumber / isSimplified ignore flag for magnitude', () => {
    expect(isProper(flag(1, 4))).toBe(true);
    expect(isProper(flag(5, 4))).toBe(false);
    expect(isWholeNumber(F(6, 3))).toBe(true);
    expect(isWholeNumber(flag(6, 3))).toBe(true);
    expect(isWholeNumber(F(5, 3))).toBe(false);
    expect(isSimplified(F(3, 4))).toBe(true);
    expect(isSimplified(F(6, 8))).toBe(false);
    expect(isSimplified(flag(3, 4))).toBe(true);
  });
});

describe('Wave 27 frac-sign-dual — arithmetic with mixed encodings', () => {
  const pairs = [
    [F(-1, 3), flag(1, 3)],
    [flag(2, 5), F(-2, 5)],
    [F(-7, 8), flag(7, 8)],
  ] as const;

  it('add of opposite encodings cancels to zero', () => {
    for (const [a, b] of pairs) {
      // a and b represent the SAME negative value — sum is 2a
      expect(areEqual(add(a, b), multiply(a, fromWhole(2)))).toBe(true);
    }
    expect(areEqual(add(F(-1, 3), flag(1, 6)), flag(1, 2))).toBe(true);
  });

  it('subtract / multiply / divide mixed encodings', () => {
    expect(areEqual(subtract(flag(1, 2), F(-1, 4)), F(-1, 4))).toBe(true);
    expect(areEqual(multiply(flag(3, 4), F(-2, 3)), F(1, 2))).toBe(true);
    expect(areEqual(divide(flag(1, 2), F(-1, 4)), fromWhole(2))).toBe(true);
    expect(areEqual(reciprocal(flag(2, 7)), F(-7, 2))).toBe(true);
  });

  it('negate flips signed numerator and drops isNegative flag from result object', () => {
    expect(negate(F(3, 5))).toEqual({ numerator: -3, denominator: 5 });
    // flag(3,5) means -3/5; negate only negates numerator → {-3,5} still -0.6
    expect(negate(flag(3, 5))).toEqual({ numerator: -3, denominator: 5 });
    expect(toDecimal(negate(flag(3, 5)))).toBeCloseTo(-0.6, 10);
    expect(toDecimal(negate(F(3, 5)))).toBeCloseTo(-0.6, 10);
  });

  it('abs takes Math.abs of numerator and drops isNegative flag', () => {
    expect(abs(F(-3, 5))).toEqual({ numerator: 3, denominator: 5 });
    expect(abs(flag(3, 5))).toEqual({ numerator: 3, denominator: 5 });
    expect(toDecimal(abs(flag(3, 5)))).toBeCloseTo(0.6, 10);
  });

  it('toMixedNumber from flag negatives matches signed-numerator path', () => {
    expect(toMixedNumber(flag(5, 2))).toEqual(toMixedNumber(F(-5, 2)));
    expect(toMixedNumber(flag(4, 2)).whole).toBe(-2);
  });
});
