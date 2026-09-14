/**
 * Wave 27 — fromDecimal continued-fraction path, getFactors, roundToDenominator.
 * Distinct from wave 21 fraction-bar-ui and basic fromDecimal smoke in fractions.test.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  createFraction,
  fromWhole,
  fromDecimal,
  getFactors,
  roundToDenominator,
  areEqual,
  toDecimal,
  simplify,
  formatFraction,
  parseFraction,
  COMMON_FRACTIONS,
  FRACTION_COLORS,
} from '../../src/core/fractions';

const F = createFraction;

describe('Wave 27 frac-decimal-factors — fromDecimal common denoms', () => {
  it('maps integers and classic decimals via common-denominator fast path', () => {
    expect(fromDecimal(0)).toEqual(fromWhole(0));
    expect(fromDecimal(7)).toEqual(fromWhole(7));
    expect(fromDecimal(-3)).toEqual(fromWhole(-3));
    expect(areEqual(fromDecimal(0.5), F(1, 2))).toBe(true);
    expect(areEqual(fromDecimal(0.25), F(1, 4))).toBe(true);
    expect(areEqual(fromDecimal(0.75), F(3, 4))).toBe(true);
    expect(areEqual(fromDecimal(0.125), F(1, 8))).toBe(true);
    expect(areEqual(fromDecimal(0.2), F(1, 5))).toBe(true);
    expect(areEqual(fromDecimal(0.1), F(1, 10))).toBe(true);
    expect(areEqual(fromDecimal(-0.5), F(-1, 2))).toBe(true);
  });

  it('uses continued-fraction approximation for awkward decimals', () => {
    // 1/7 ≈ 0.142857... not in common denom terminating list
    const seventh = fromDecimal(1 / 7, 50);
    expect(areEqual(seventh, F(1, 7))).toBe(true);

    const piApprox = fromDecimal(Math.PI, 100);
    // Implementation may overshoot maxDenominator by one CF step — still close
    expect(Math.abs(toDecimal(piApprox) - Math.PI)).toBeLessThan(0.01);
    expect(piApprox.denominator).toBeGreaterThan(1);

    const eApprox = fromDecimal(Math.E, 30);
    expect(Math.abs(toDecimal(eApprox) - Math.E)).toBeLessThan(0.05);
  });

  it('tighter maxDenominator yields a closer or equal π approximation', () => {
    const loose = fromDecimal(Math.PI, 10);
    const tight = fromDecimal(Math.PI, 1000);
    const looseErr = Math.abs(toDecimal(loose) - Math.PI);
    const tightErr = Math.abs(toDecimal(tight) - Math.PI);
    expect(tightErr).toBeLessThanOrEqual(looseErr + 1e-12);
    expect(tight.denominator).toBeGreaterThanOrEqual(loose.denominator);
  });

  it('round-trips COMMON_FRACTIONS decimals through fromDecimal', () => {
    for (const f of COMMON_FRACTIONS) {
      const d = toDecimal(f);
      const back = fromDecimal(d, 100);
      expect(areEqual(simplify(back), simplify(f))).toBe(true);
    }
  });
});

describe('Wave 27 frac-decimal-factors — getFactors', () => {
  it('returns sorted unique factors for typical values', () => {
    expect(getFactors(1)).toEqual([1]);
    expect(getFactors(2)).toEqual([1, 2]);
    expect(getFactors(6)).toEqual([1, 2, 3, 6]);
    expect(getFactors(12)).toEqual([1, 2, 3, 4, 6, 12]);
    expect(getFactors(16)).toEqual([1, 2, 4, 8, 16]);
    expect(getFactors(17)).toEqual([1, 17]);
    expect(getFactors(100)).toEqual([1, 2, 4, 5, 10, 20, 25, 50, 100]);
  });

  it('uses absolute value for negatives and zero yields [0] path via abs(0)', () => {
    expect(getFactors(-12)).toEqual([1, 2, 3, 4, 6, 12]);
    expect(getFactors(-7)).toEqual([1, 7]);
    // n=0 → abs 0; loop i<=sqrt(0) never runs → []
    expect(getFactors(0)).toEqual([]);
  });

  it('every listed factor divides n; product of first*last is n for n>0', () => {
    for (const n of [9, 18, 24, 36, 48, 60]) {
      const factors = getFactors(n);
      for (const f of factors) {
        expect(n % f).toBe(0);
      }
      expect(factors[0] * factors[factors.length - 1]).toBe(n);
    }
  });
});

describe('Wave 27 frac-decimal-factors — roundToDenominator', () => {
  it('rounds midpoints and nearby values to nearest target denom', () => {
    expect(roundToDenominator(F(1, 3), 2)).toEqual({
      numerator: 1,
      denominator: 2,
    });
    expect(roundToDenominator(F(1, 2), 4)).toEqual({
      numerator: 2,
      denominator: 4,
    });
    expect(roundToDenominator(F(2, 3), 3)).toEqual({
      numerator: 2,
      denominator: 3,
    });
    expect(roundToDenominator(fromWhole(1), 8)).toEqual({
      numerator: 8,
      denominator: 8,
    });
  });

  it('rounds negatives via toDecimal then Math.round', () => {
    const r = roundToDenominator(F(-1, 3), 2);
    expect(r.denominator).toBe(2);
    expect(r.numerator).toBe(-1);
  });

  it('round then fromDecimal of same value stays close for tenths', () => {
    const v = fromDecimal(0.37, 100);
    const rounded = roundToDenominator(v, 10);
    expect(rounded.denominator).toBe(10);
    expect(Math.abs(toDecimal(rounded) - toDecimal(v))).toBeLessThan(0.06);
  });
});

describe('Wave 27 frac-decimal-factors — format/parse bridge with decimals', () => {
  it('formatFraction of fromDecimal common values parses back', () => {
    for (const d of [0.5, 0.25, 0.75, 0.125, 0.2, -0.5]) {
      const f = fromDecimal(d);
      const parsed = parseFraction(formatFraction(f, { simplify: true }));
      expect(parsed).not.toBeNull();
      expect(areEqual(parsed!, f)).toBe(true);
    }
  });

  it('FRACTION_COLORS catalogs known denominators used by COMMON_FRACTIONS', () => {
    const dens = new Set(COMMON_FRACTIONS.map((f) => f.denominator));
    for (const d of [1, 2, 3, 4, 5, 6, 8, 10, 12]) {
      expect(FRACTION_COLORS[d]).toMatch(/^#/);
      if (d !== 1) expect(dens.has(d)).toBe(true);
    }
  });
});
