/**
 * Wave 37 — toDecimal grid leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createFraction,
  toDecimal,
  fromDecimal,
  areEqual,
  simplify,
} from '../../src/core/fractions';

describe('Wave 37 frac-todecimal — n/d grid', () => {
  it('matches n/d for -10..10 over denoms 1..12', () => {
    for (let n = -10; n <= 10; n++) {
      for (let d = 1; d <= 12; d++) {
        const f = createFraction(n, d);
        expect(toDecimal(f)).toBeCloseTo(n / d, 12);
      }
    }
  });

  it('fromDecimal(toDecimal(f)) recovers commons', () => {
    for (let d = 2; d <= 10; d++) {
      for (let n = 1; n < d; n++) {
        const f = createFraction(n, d);
        const back = fromDecimal(toDecimal(f), 100);
        expect(areEqual(simplify(back), simplify(f))).toBe(true);
      }
    }
  });
});
