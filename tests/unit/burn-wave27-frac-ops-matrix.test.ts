/**
 * Wave 27 — fraction add/sub/mul/div/power/reciprocal operator matrix.
 * Distinct from wave 21 fraction-bar-ui and existing fractions.test smoke cases.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  createFraction,
  fromWhole,
  add,
  subtract,
  multiply,
  divide,
  reciprocal,
  power,
  simplify,
  areEqual,
  areEquivalent,
  toDecimal,
  negate,
  abs,
} from '../../src/core/fractions';

const F = createFraction;
const flagNeg = (n: number, d: number) =>
  ({ numerator: n, denominator: d, isNegative: true }) as const;

describe('Wave 27 frac-ops-matrix — add across dual negative styles', () => {
  it('adds same-denominator and LCD pairs with auto-simplify', () => {
    expect(add(F(1, 4), F(1, 4))).toEqual({
      numerator: 1,
      denominator: 2,
      isNegative: false,
    });
    expect(areEqual(add(F(1, 3), F(1, 6)), F(1, 2))).toBe(true);
    expect(areEqual(add(F(2, 5), F(3, 5)), fromWhole(1))).toBe(true);
  });

  it('adds isNegative-flag operands equivalently to signed numerators', () => {
    const a = add(flagNeg(1, 2), F(3, 4));
    const b = add(F(-1, 2), F(3, 4));
    expect(areEqual(a, b)).toBe(true);
    expect(areEqual(a, F(1, 4))).toBe(true);

    const c = add(flagNeg(1, 3), flagNeg(1, 6));
    expect(areEqual(c, F(-1, 2))).toBe(true);
  });

  it('adding zero is identity after equality check', () => {
    for (const f of [F(3, 7), F(-2, 5), flagNeg(4, 9), fromWhole(0)]) {
      expect(areEqual(add(f, fromWhole(0)), f)).toBe(true);
      expect(areEqual(add(fromWhole(0), f), f)).toBe(true);
    }
  });
});

describe('Wave 27 frac-ops-matrix — subtract (raw LCD, not auto-simplified)', () => {
  it('subtracts same and different denominators without forcing simplify', () => {
    const same = subtract(F(3, 4), F(1, 4));
    expect(same).toEqual({ numerator: 2, denominator: 4 });
    expect(areEquivalent(same, F(1, 2))).toBe(true);

    const diff = subtract(F(1, 2), F(1, 3));
    expect(diff.denominator).toBe(6);
    expect(diff.numerator).toBe(1);
  });

  it('handles flag-negative minuend/subtrahend', () => {
    expect(areEqual(subtract(flagNeg(1, 2), F(1, 4)), F(-3, 4))).toBe(true);
    expect(areEqual(subtract(F(1, 2), flagNeg(1, 4)), F(3, 4))).toBe(true);
    expect(areEqual(subtract(flagNeg(1, 2), flagNeg(1, 4)), F(-1, 4))).toBe(
      true
    );
  });

  it('a - a equals zero numerically', () => {
    for (const f of [F(5, 9), F(-3, 8), flagNeg(2, 7)]) {
      expect(areEqual(subtract(f, f), fromWhole(0))).toBe(true);
    }
  });
});

describe('Wave 27 frac-ops-matrix — multiply / divide / reciprocal', () => {
  it('multiplies including zeros and flag negatives (raw product form)', () => {
    expect(multiply(F(2, 3), F(3, 4))).toEqual({
      numerator: 6,
      denominator: 12,
    });
    expect(areEqual(multiply(F(2, 3), F(3, 4)), F(1, 2))).toBe(true);
    expect(multiply(F(0, 5), F(7, 9))).toEqual({
      numerator: 0,
      denominator: 45,
    });
    expect(areEqual(multiply(flagNeg(2, 5), F(1, 2)), F(-1, 5))).toBe(true);
    expect(areEqual(multiply(flagNeg(1, 2), flagNeg(1, 3)), F(1, 6))).toBe(
      true
    );
  });

  it('divides and throws on zero divisor', () => {
    expect(areEqual(divide(F(1, 2), F(1, 4)), fromWhole(2))).toBe(true);
    expect(areEqual(divide(F(3, 4), F(3, 2)), F(1, 2))).toBe(true);
    expect(areEqual(divide(flagNeg(1, 2), F(1, 4)), fromWhole(-2))).toBe(true);
    expect(() => divide(F(1, 2), F(0, 5))).toThrow(/zero/i);
    expect(() => divide(F(1, 2), fromWhole(0))).toThrow(/zero/i);
  });

  it('reciprocal swaps and preserves sign; rejects zero', () => {
    expect(reciprocal(F(2, 3))).toEqual({ numerator: 3, denominator: 2 });
    expect(areEqual(reciprocal(F(-2, 5)), F(-5, 2))).toBe(true);
    expect(areEqual(reciprocal(flagNeg(2, 5)), F(-5, 2))).toBe(true);
    expect(() => reciprocal(fromWhole(0))).toThrow(/zero/i);
    expect(() => reciprocal(F(0, 3))).toThrow(/zero/i);
  });

  it('multiply by reciprocal equals divide numerically', () => {
    const pairs = [
      [F(2, 5), F(3, 7)],
      [F(-1, 4), F(2, 3)],
      [flagNeg(3, 8), F(1, 2)],
    ] as const;
    for (const [a, b] of pairs) {
      expect(areEqual(divide(a, b), multiply(a, reciprocal(b)))).toBe(true);
    }
  });
});

describe('Wave 27 frac-ops-matrix — power', () => {
  it('handles zero, positive, and negative exponents', () => {
    expect(areEqual(power(F(2, 3), 0), fromWhole(1))).toBe(true);
    expect(power(F(2, 3), 2)).toEqual({ numerator: 4, denominator: 9 });
    expect(areEqual(power(F(2, 3), 3), F(8, 27))).toBe(true);
    expect(areEqual(power(F(2, 3), -1), F(3, 2))).toBe(true);
    expect(areEqual(power(F(2, 3), -2), F(9, 4))).toBe(true);
  });

  it('powers flag-negative bases', () => {
    expect(areEqual(power(flagNeg(1, 2), 2), F(1, 4))).toBe(true);
    expect(areEqual(power(flagNeg(1, 2), 3), F(-1, 8))).toBe(true);
    expect(areEqual(power(flagNeg(1, 2), -1), fromWhole(-2))).toBe(true);
  });
});

describe('Wave 27 frac-ops-matrix — negate / abs interact with operators', () => {
  it('negate then add cancels; abs of product is non-negative', () => {
    const f = F(5, 7);
    expect(areEqual(add(f, negate(f)), fromWhole(0))).toBe(true);
    const p = multiply(flagNeg(3, 4), F(2, 5));
    expect(toDecimal(abs(p))).toBeGreaterThanOrEqual(0);
    expect(areEqual(abs(p), simplify(F(6, 20)))).toBe(true);
  });

  it('operator table for several pairs stays associative for add of three', () => {
    const a = F(1, 6);
    const b = F(1, 3);
    const c = F(1, 2);
    expect(areEqual(add(add(a, b), c), add(a, add(b, c)))).toBe(true);
    expect(areEqual(add(add(a, b), c), fromWhole(1))).toBe(true);
  });
});
