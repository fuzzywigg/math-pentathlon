/**
 * Wave 37 — power exponent ladder leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createFraction,
  power,
  reciprocal,
  areEqual,
  simplify,
  fromWhole,
  multiply,
} from '../../src/core/fractions';

describe('Wave 37 frac-power — exponent ladder', () => {
  const bases = [
    createFraction(2, 3),
    createFraction(3, 4),
    createFraction(-2, 5),
    createFraction(1, 2),
  ];

  it('exponent 0..4 matches repeated multiply', () => {
    for (const b of bases) {
      expect(areEqual(power(b, 0), fromWhole(1))).toBe(true);
      let acc = fromWhole(1);
      for (let e = 1; e <= 4; e++) {
        acc = multiply(acc, b);
        expect(areEqual(simplify(power(b, e)), simplify(acc))).toBe(true);
      }
    }
  });

  it('negative exponents equal reciprocal of positive power', () => {
    for (const b of bases) {
      for (const e of [1, 2, 3]) {
        expect(
          areEqual(simplify(power(b, -e)), simplify(reciprocal(power(b, e))))
        ).toBe(true);
      }
    }
  });

  it('power of unit fraction 1/n', () => {
    for (let n = 2; n <= 8; n++) {
      const p = power(createFraction(1, n), 3);
      expect(p).toEqual({ numerator: 1, denominator: n ** 3 });
    }
  });
});
