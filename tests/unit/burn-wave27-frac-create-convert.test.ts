/**
 * Wave 27 — createFraction / gcd / lcm / conversion / predicate tables.
 * Distinct from wave 21 fraction-bar-ui. Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  gcd,
  lcm,
  createFraction,
  fromWhole,
  fromMixedNumber,
  toMixedNumber,
  toDecimal,
  simplify,
  isSimplified,
  areEqual,
  compare,
  isProper,
  isWholeNumber,
  isZero,
  isPositive,
  isNegative,
  add,
  subtract,
  multiply,
  COMMON_FRACTIONS,
} from '../../src/core/fractions';

const F = createFraction;

describe('Wave 27 frac-create-convert — gcd/lcm exhaustive small grid', () => {
  it('gcd is symmetric and divides both args for 0..30', () => {
    for (let a = 0; a <= 30; a++) {
      for (let b = 0; b <= 30; b++) {
        const g = gcd(a, b);
        expect(gcd(b, a)).toBe(g);
        if (a !== 0) expect(a % g).toBe(0);
        if (b !== 0) expect(b % g).toBe(0);
        if (a === 0 && b === 0) expect(g).toBe(0);
      }
    }
  });

  it('lcm(a,b) * gcd(a,b) === |a*b| for nonzero pairs', () => {
    for (const a of [1, 2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 16, 18, 20, 24]) {
      for (const b of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 15]) {
        expect(lcm(a, b) * gcd(a, b)).toBe(a * b);
        expect(lcm(-a, b)).toBe(lcm(a, b));
        expect(lcm(a, -b)).toBe(lcm(a, b));
      }
    }
  });

  it('lcm with zero is zero; gcd with zero is abs of other', () => {
    expect(lcm(0, 12)).toBe(0);
    expect(lcm(12, 0)).toBe(0);
    expect(gcd(0, 12)).toBe(12);
    expect(gcd(12, 0)).toBe(12);
    expect(gcd(0, 0)).toBe(0);
  });
});

describe('Wave 27 frac-create-convert — createFraction / fromWhole / fromMixed', () => {
  it('createFraction rejects zero denom and flips negative denoms', () => {
    expect(() => createFraction(1, 0)).toThrow(/denominator/i);
    expect(() => createFraction(0, 0)).toThrow(/denominator/i);
    expect(createFraction(3, -4)).toEqual({ numerator: -3, denominator: 4 });
    expect(createFraction(-3, -4)).toEqual({ numerator: 3, denominator: 4 });
    expect(createFraction(0, -5)).toEqual({ numerator: -0, denominator: 5 });
  });

  it('fromWhole covers negative zero-ish and large values', () => {
    expect(fromWhole(-10)).toEqual({ numerator: -10, denominator: 1 });
    expect(fromWhole(0)).toEqual({ numerator: 0, denominator: 1 });
    expect(fromWhole(1000)).toEqual({ numerator: 1000, denominator: 1 });
  });

  it('fromMixedNumber table for positive and negative wholes', () => {
    const table: Array<[number, number, number, number, number]> = [
      [1, 1, 2, 3, 2],
      [2, 3, 4, 11, 4],
      [0, 2, 5, 2, 5],
      [-1, 1, 2, -3, 2],
      [-3, 1, 4, -13, 4],
    ];
    for (const [w, n, d, en, ed] of table) {
      expect(fromMixedNumber(w, n, d)).toEqual({
        numerator: en,
        denominator: ed,
      });
    }
  });
});

describe('Wave 27 frac-create-convert — mixed/decimal round trips', () => {
  it('toMixedNumber then fromMixedNumber recovers improper value', () => {
    for (const f of [
      F(7, 3),
      F(11, 4),
      F(5, 2),
      F(-7, 3),
      F(9, 2),
      F(1, 5),
      fromWhole(4),
    ]) {
      const mixed = toMixedNumber(f);
      const back = fromMixedNumber(
        mixed.whole,
        mixed.fraction.numerator,
        mixed.fraction.denominator
      );
      expect(areEqual(back, f)).toBe(true);
    }
  });

  it('toDecimal of COMMON_FRACTIONS matches numerator/denominator', () => {
    for (const f of COMMON_FRACTIONS) {
      expect(toDecimal(f)).toBeCloseTo(f.numerator / f.denominator, 12);
    }
  });

  it('simplify leaves COMMON_FRACTIONS unchanged in value and simplest form', () => {
    for (const f of COMMON_FRACTIONS) {
      expect(isSimplified(f)).toBe(true);
      const s = simplify(f);
      expect(areEqual(s, f)).toBe(true);
      expect(s.numerator).toBe(f.numerator);
      expect(s.denominator).toBe(f.denominator);
    }
  });
});

describe('Wave 27 frac-create-convert — predicate / compare tables', () => {
  it('isProper / isWholeNumber / isZero matrix', () => {
    const cases: Array<{
      f: ReturnType<typeof F>;
      proper: boolean;
      whole: boolean;
      zero: boolean;
    }> = [
      { f: F(1, 2), proper: true, whole: false, zero: false },
      { f: F(3, 2), proper: false, whole: false, zero: false },
      { f: F(4, 2), proper: false, whole: true, zero: false },
      { f: F(0, 5), proper: true, whole: true, zero: true },
      { f: F(-1, 3), proper: true, whole: false, zero: false },
      { f: F(-6, 3), proper: false, whole: true, zero: false },
      { f: fromWhole(1), proper: false, whole: true, zero: false },
    ];
    for (const c of cases) {
      expect(isProper(c.f)).toBe(c.proper);
      expect(isWholeNumber(c.f)).toBe(c.whole);
      expect(isZero(c.f)).toBe(c.zero);
    }
  });

  it('isPositive / isNegative exclusive for nonzero fractions', () => {
    for (const f of [F(1, 2), F(3, 4), fromWhole(2), F(-1, 5), F(-2, 7)]) {
      if (isZero(f)) continue;
      expect(isPositive(f)).toBe(!isNegative(f));
    }
    expect(isPositive(fromWhole(0))).toBe(false);
    expect(isNegative(fromWhole(0))).toBe(false);
  });

  it('compare is anti-symmetric and agrees with decimal order', () => {
    const sample = [
      F(1, 5),
      F(1, 4),
      F(1, 3),
      F(1, 2),
      F(2, 3),
      F(3, 4),
      F(-1, 2),
      fromWhole(0),
      fromWhole(1),
    ];
    for (const a of sample) {
      for (const b of sample) {
        const c = compare(a, b);
        expect(compare(b, a)).toBe(c === 0 ? 0 : ((-c) as -1 | 1));
        if (c < 0) expect(toDecimal(a)).toBeLessThan(toDecimal(b));
        if (c > 0) expect(toDecimal(a)).toBeGreaterThan(toDecimal(b));
        if (c === 0) expect(areEqual(a, b)).toBe(true);
      }
    }
  });
});

describe('Wave 27 frac-create-convert — arithmetic identities on COMMON_FRACTIONS', () => {
  it('a + 0 = a, a - a = 0, a * 1 = a for common fractions', () => {
    for (const a of COMMON_FRACTIONS.slice(0, 12)) {
      expect(areEqual(add(a, fromWhole(0)), a)).toBe(true);
      expect(areEqual(subtract(a, a), fromWhole(0))).toBe(true);
      expect(areEqual(multiply(a, fromWhole(1)), a)).toBe(true);
    }
  });

  it('pairwise add is commutative for a sample of commons', () => {
    const sample = COMMON_FRACTIONS.slice(0, 8);
    for (const a of sample) {
      for (const b of sample) {
        expect(areEqual(add(a, b), add(b, a))).toBe(true);
      }
    }
  });
});
