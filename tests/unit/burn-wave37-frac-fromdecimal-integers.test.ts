/**
 * Wave 37 — fromDecimal integer / near-integer leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  fromDecimal,
  fromWhole,
  areEqual,
  toDecimal,
} from '../../src/core/fractions';

describe('Wave 37 frac-fromdecimal-int — integers and near', () => {
  it('integers -50..50 map to fromWhole', () => {
    for (let i = -50; i <= 50; i++) {
      expect(fromDecimal(i)).toEqual(fromWhole(i));
    }
  });

  it('values extremely close to integers still take CF or common path safely', () => {
    for (const base of [1, 2, 5, -3]) {
      const f = fromDecimal(base + 1e-15, 100);
      expect(Math.abs(toDecimal(f) - base)).toBeLessThan(1e-6);
    }
  });
});
