/**
 * Wave 37 — createFraction negative-denominator flip leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createFraction,
  areEqual,
  toDecimal,
  simplify,
} from '../../src/core/fractions';

describe('Wave 37 frac-create — denom sign flips', () => {
  it('flips both signs so denominator positive', () => {
    const rows = [
      [3, -4, -3, 4],
      [-3, -4, 3, 4],
      [0, -5, -0, 5],
      [7, -1, -7, 1],
      [-7, -1, 7, 1],
    ];
    for (const [n, d, en, ed] of rows) {
      const f = createFraction(n, d);
      expect(f.denominator).toBe(ed);
      expect(Object.is(f.numerator, en) || f.numerator === en).toBe(true);
      expect(areEqual(f, createFraction(en, ed))).toBe(true);
    }
  });

  it('throws on zero denominator for many numerators', () => {
    for (const n of [-5, -1, 0, 1, 5, 100]) {
      expect(() => createFraction(n, 0)).toThrow(/denominator/i);
    }
  });

  it('simplify of flipped equals simplify of canonical', () => {
    for (let n = -9; n <= 9; n++) {
      for (const d of [-8, -3, -1, 1, 3, 8]) {
        if (d === 0) continue;
        const f = createFraction(n, d);
        expect(f.denominator).toBeGreaterThan(0);
        expect(toDecimal(simplify(f))).toBeCloseTo(n / d, 12);
      }
    }
  });
});
