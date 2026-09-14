/**
 * Wave 37 — fraction power / roundToDenominator / reciprocal dense matrix.
 * Beyond wave 27 ops-matrix smoke. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createFraction,
  fromWhole,
  power,
  reciprocal,
  roundToDenominator,
  areEqual,
  areEquivalent,
  multiply,
  toDecimal,
  abs,
  negate,
} from '../../src/core/fractions';

const F = createFraction;
const flag = (n: number, d: number) =>
  ({ numerator: n, denominator: d, isNegative: true }) as const;

describe('Wave 37 frac-power — integer exponents', () => {
  it('power 0 is 1; power 1 is identity; power 2 squares', () => {
    for (const f of [F(3, 4), F(-2, 5), flag(1, 3), fromWhole(7)]) {
      expect(areEqual(power(f, 0), fromWhole(1))).toBe(true);
      expect(areEqual(power(f, 1), f)).toBe(true);
    }
    expect(areEqual(power(F(2, 3), 2), F(4, 9))).toBe(true);
    expect(areEqual(power(F(-3, 2), 2), F(9, 4))).toBe(true);
    expect(areEqual(power(flag(2, 5), 3), F(-8, 125))).toBe(true);
  });

  it('negative exponents equal reciprocal raised to |e|', () => {
    expect(areEqual(power(F(2, 3), -1), F(3, 2))).toBe(true);
    expect(areEqual(power(F(2, 3), -2), F(9, 4))).toBe(true);
    expect(areEqual(power(F(-1, 4), -1), F(-4, 1))).toBe(true);
    expect(areEqual(power(flag(1, 2), -2), F(4, 1))).toBe(true);
  });

  it('power then reciprocal equals reciprocal then power for |e|', () => {
    const f = F(3, 5);
    expect(areEqual(reciprocal(power(f, 3)), power(reciprocal(f), 3))).toBe(
      true
    );
  });
});

describe('Wave 37 frac-round — denominator snapping', () => {
  it('already-denominated fractions snap to themselves', () => {
    expect(roundToDenominator(F(3, 8), 8)).toEqual({
      numerator: 3,
      denominator: 8,
    });
    expect(roundToDenominator(F(1, 2), 2)).toEqual({
      numerator: 1,
      denominator: 2,
    });
  });

  it('rounds midpoints via Math.round on scaled decimal', () => {
    // 1/3 ≈ 0.333 → *8 ≈ 2.666 → rounds to 3/8
    expect(roundToDenominator(F(1, 3), 8)).toEqual({
      numerator: 3,
      denominator: 8,
    });
    // 1/2 → *4 = 2 exactly
    expect(roundToDenominator(F(1, 2), 4)).toEqual({
      numerator: 2,
      denominator: 4,
    });
  });

  it('negative and flag-negative round consistently', () => {
    const a = roundToDenominator(F(-1, 3), 8);
    const b = roundToDenominator(flag(1, 3), 8);
    expect(a.numerator).toBe(b.numerator);
    expect(a.denominator).toBe(b.denominator);
    expect(a.numerator).toBeLessThan(0);
  });

  it('round then toDecimal is within half a tick of original', () => {
    for (const f of [F(5, 7), F(11, 13), F(-2, 9)]) {
      for (const d of [4, 8, 10, 12]) {
        const r = roundToDenominator(f, d);
        expect(r.denominator).toBe(d);
        expect(Math.abs(toDecimal(r) - toDecimal(f))).toBeLessThanOrEqual(
          0.5 / d + 1e-9
        );
      }
    }
  });
});

describe('Wave 37 frac-reciprocal — dual forms', () => {
  it('reciprocal twice is identity under equality', () => {
    for (const f of [F(2, 7), F(-3, 5), flag(4, 9), fromWhole(-2)]) {
      expect(areEqual(reciprocal(reciprocal(f)), f)).toBe(true);
    }
  });

  it('abs(reciprocal(f)) equals reciprocal(abs(f))', () => {
    for (const f of [F(-3, 8), flag(5, 6)]) {
      expect(areEqual(abs(reciprocal(f)), reciprocal(abs(f)))).toBe(true);
    }
  });

  it('f * reciprocal(f) is 1; negate swaps sign of reciprocal', () => {
    const f = F(5, 9);
    expect(areEqual(multiply(f, reciprocal(f)), fromWhole(1))).toBe(true);
    expect(areEqual(reciprocal(negate(f)), negate(reciprocal(f)))).toBe(true);
  });

  it('equivalent unsimplified inputs share reciprocal value', () => {
    expect(areEquivalent(reciprocal(F(2, 4)), reciprocal(F(1, 2)))).toBe(true);
  });
});
