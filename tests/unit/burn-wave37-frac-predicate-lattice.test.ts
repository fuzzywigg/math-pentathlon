/**
 * Wave 37 — fraction predicate lattice across dual sign encodings.
 * Distinct from wave 27 create-convert matrix. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createFraction,
  fromWhole,
  isPositive,
  isNegative,
  isZero,
  isProper,
  isWholeNumber,
  isSimplified,
  simplify,
  compare,
  abs,
  negate,
} from '../../src/core/fractions';

const F = createFraction;
const flag = (n: number, d: number) =>
  ({ numerator: n, denominator: d, isNegative: true }) as const;

describe('Wave 37 frac-predicates — sign dual agreement', () => {
  it('signed numerator and isNegative flag agree on polarity predicates', () => {
    const pairs = [
      [F(-3, 4), flag(3, 4)],
      [F(-1, 1), flag(1, 1)],
      [F(-5, 2), flag(5, 2)],
    ] as const;
    for (const [a, b] of pairs) {
      expect(isNegative(a)).toBe(true);
      expect(isNegative(b)).toBe(true);
      expect(isPositive(a)).toBe(false);
      expect(isPositive(b)).toBe(false);
      expect(isZero(a)).toBe(false);
      expect(isZero(b)).toBe(false);
      expect(compare(a, b)).toBe(0);
    }
  });

  it('zero variants are zero; flag-zero still reports isNegative from flag', () => {
    for (const z of [fromWhole(0), F(0, 5), F(0, 1)]) {
      expect(isZero(z)).toBe(true);
      expect(isPositive(z)).toBe(false);
      expect(isNegative(z)).toBe(false);
    }
    const flagZero = { numerator: 0, denominator: 3, isNegative: true };
    expect(isZero(flagZero)).toBe(true);
    expect(isNegative(flagZero)).toBe(true); // flag wins even when numerator is 0
  });
});

describe('Wave 37 frac-predicates — proper / whole / simplified', () => {
  it('proper iff |num| < den after abs', () => {
    expect(isProper(F(1, 2))).toBe(true);
    expect(isProper(F(3, 3))).toBe(false);
    expect(isProper(F(5, 4))).toBe(false);
    expect(isProper(F(-1, 3))).toBe(true);
    expect(isProper(flag(2, 5))).toBe(true);
    expect(isProper(flag(9, 4))).toBe(false);
  });

  it('whole number iff denominator divides numerator (value integer)', () => {
    expect(isWholeNumber(fromWhole(4))).toBe(true);
    expect(isWholeNumber(F(6, 3))).toBe(true);
    expect(isWholeNumber(F(6, 4))).toBe(false);
    expect(isWholeNumber(F(-8, 2))).toBe(true);
    expect(isWholeNumber(flag(9, 3))).toBe(true);
  });

  it('simplify is idempotent; result is always isSimplified', () => {
    const samples = [
      F(1, 2),
      F(2, 4),
      F(6, 9),
      F(-4, 8),
      flag(3, 9),
      fromWhole(5),
      F(0, 7),
    ];
    for (const f of samples) {
      const s = simplify(f);
      expect(isSimplified(s)).toBe(true);
      expect(simplify(s)).toEqual(s);
      expect(compare(f, s)).toBe(0);
    }
    expect(isSimplified(F(2, 4))).toBe(false);
    expect(isSimplified(F(3, 4))).toBe(true);
    expect(isSimplified(F(0, 7))).toBe(false); // gcd(0,7)=7
  });

  it('abs never negative; negate flips polarity for signed-numerator forms', () => {
    for (const f of [F(3, 7), F(-2, 5)]) {
      expect(isNegative(abs(f))).toBe(false);
      expect(isPositive(f) !== isPositive(negate(f))).toBe(true);
      expect(isNegative(f) !== isNegative(negate(f))).toBe(true);
    }
    // flag-style: negate only flips numerator sign and drops the flag
    const flagged = flag(4, 9);
    expect(isNegative(flagged)).toBe(true);
    expect(isNegative(negate(flagged))).toBe(true); // numerator becomes -4
    expect(isNegative(abs(flagged))).toBe(false);
  });
});
