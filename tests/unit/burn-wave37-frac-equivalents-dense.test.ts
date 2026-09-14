/**
 * Wave 37 — findEquivalentFractions dense leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createFraction,
  findEquivalentFractions,
  areEqual,
  simplify,
} from '../../src/core/fractions';

describe('Wave 37 frac-equivalents — density', () => {
  it('count equals floor(max/baseDenom) after simplify', () => {
    for (const base of [
      createFraction(1, 2),
      createFraction(2, 4),
      createFraction(3, 9),
      createFraction(-1, 5),
    ]) {
      for (const maxD of [5, 10, 20, 30]) {
        const eq = findEquivalentFractions(base, maxD);
        const s = simplify(base);
        const expected = Math.floor(maxD / s.denominator);
        expect(eq).toHaveLength(Math.max(0, expected));
        for (const e of eq) {
          expect(areEqual(e, base)).toBe(true);
          expect(e.denominator).toBeLessThanOrEqual(maxD);
        }
      }
    }
  });

  it('empty when maxDenominator below simplified denom', () => {
    expect(findEquivalentFractions(createFraction(1, 8), 7)).toEqual([]);
  });
});
