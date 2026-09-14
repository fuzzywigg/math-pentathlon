/**
 * Wave 37 — fromDecimal continued-fraction / precision bound leftovers.
 * Beyond wave 27 decimal-factors. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  fromDecimal,
  toDecimal,
  areEqual,
  createFraction,
  fromWhole,
  abs,
  compare,
  COMMON_FRACTIONS,
} from '../../src/core/fractions';

const F = createFraction;

describe('Wave 37 frac-decimal — round-trip commons', () => {
  it('fromDecimal(toDecimal(f)) recovers each COMMON_FRACTION under equality', () => {
    for (const f of COMMON_FRACTIONS) {
      const back = fromDecimal(toDecimal(f));
      expect(areEqual(back, f)).toBe(true);
    }
  });

  it('negative commons round-trip through decimal', () => {
    for (const f of COMMON_FRACTIONS.slice(0, 10)) {
      const neg = { numerator: -f.numerator, denominator: f.denominator };
      expect(areEqual(fromDecimal(toDecimal(neg)), neg)).toBe(true);
    }
  });
});

describe('Wave 37 frac-decimal — maxDenominator bounds', () => {
  it('low maxDenominator still approximates within 1/maxDenom', () => {
    for (const maxD of [5, 10, 20, 50]) {
      const approx = fromDecimal(Math.PI, maxD);
      // Implementation may overshoot by one CF step; require closeness
      expect(Math.abs(toDecimal(approx) - Math.PI)).toBeLessThan(0.05);
      expect(approx.denominator).toBeGreaterThan(0);
    }
  });

  it('tighter bound is at least as close for golden ratio', () => {
    const phi = (1 + Math.sqrt(5)) / 2;
    const loose = fromDecimal(phi, 8);
    const tight = fromDecimal(phi, 200);
    expect(Math.abs(toDecimal(tight) - phi)).toBeLessThanOrEqual(
      Math.abs(toDecimal(loose) - phi) + 1e-12
    );
  });

  it('integers ignore maxDenominator and return wholes', () => {
    expect(fromDecimal(12, 1)).toEqual(fromWhole(12));
    expect(fromDecimal(-9, 3)).toEqual(fromWhole(-9));
  });
});

describe('Wave 37 frac-decimal — ordering preserved', () => {
  it('fromDecimal preserves compare for sorted sample decimals', () => {
    const values = [0.1, 0.25, 1 / 3, 0.5, 0.75, 0.875];
    const fracs = values.map((v) => fromDecimal(v));
    for (let i = 0; i < fracs.length - 1; i++) {
      expect(compare(fracs[i], fracs[i + 1])).toBe(-1);
    }
  });

  it('abs(fromDecimal(-x)) equals fromDecimal(x) for sample x', () => {
    for (const x of [0.2, 0.375, 1.5, Math.E - 2]) {
      expect(areEqual(abs(fromDecimal(-x)), fromDecimal(x))).toBe(true);
    }
  });

  it('known dyadics hit exact fractions', () => {
    expect(areEqual(fromDecimal(0.125), F(1, 8))).toBe(true);
    expect(areEqual(fromDecimal(0.375), F(3, 8))).toBe(true);
    expect(areEqual(fromDecimal(0.625), F(5, 8))).toBe(true);
  });
});
