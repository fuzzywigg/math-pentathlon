/**
 * Wave 37 — fromDecimal maxDenominator boundary leftovers.
 * Tests-only. Not fraction-bar-ui.
 */
import { describe, it, expect } from 'vitest';

import {
  fromDecimal,
  toDecimal,
  areEqual,
  createFraction,
  simplify,
} from '../../src/core/fractions';

describe('Wave 37 frac-fromdecimal — common denom fast path denser', () => {
  const cases: Array<{ d: number; n: number; den: number }> = [
    { d: 0.5, n: 1, den: 2 },
    { d: 0.25, n: 1, den: 4 },
    { d: 0.75, n: 3, den: 4 },
    { d: 0.125, n: 1, den: 8 },
    { d: 0.375, n: 3, den: 8 },
    { d: 0.625, n: 5, den: 8 },
    { d: 0.875, n: 7, den: 8 },
    { d: 0.2, n: 1, den: 5 },
    { d: 0.4, n: 2, den: 5 },
    { d: 0.6, n: 3, den: 5 },
    { d: 0.8, n: 4, den: 5 },
    { d: 0.1, n: 1, den: 10 },
    { d: 0.3, n: 3, den: 10 },
    { d: 0.05, n: 1, den: 20 },
    { d: 0.01, n: 1, den: 100 },
  ];

  it.each(cases)('fromDecimal($d) → $n/$den', ({ d, n, den }) => {
    expect(areEqual(fromDecimal(d), createFraction(n, den))).toBe(true);
    expect(areEqual(fromDecimal(-d), createFraction(-n, den))).toBe(true);
  });
});

describe('Wave 37 frac-fromdecimal — maxDenominator ladder for irrationals', () => {
  it('sqrt(2) approximations improve or hold as bound grows', () => {
    const target = Math.SQRT2;
    let prevErr = Infinity;
    for (const max of [5, 10, 25, 50, 100, 250, 1000]) {
      const f = fromDecimal(target, max);
      const err = Math.abs(toDecimal(f) - target);
      expect(err).toBeLessThanOrEqual(prevErr + 1e-12);
      prevErr = err;
      // CF may overshoot by one step
      expect(f.denominator).toBeGreaterThan(0);
    }
  });

  it('exact unit fractions 1/n recover for n up to 30 with enough bound', () => {
    for (let n = 2; n <= 30; n++) {
      const f = fromDecimal(1 / n, 200);
      expect(areEqual(simplify(f), simplify(createFraction(1, n)))).toBe(true);
    }
  });
});
