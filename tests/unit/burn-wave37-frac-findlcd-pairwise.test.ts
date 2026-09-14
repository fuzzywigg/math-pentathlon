/**
 * Wave 37 — findLCD pairwise vs lcm leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createFraction,
  findLCD,
  lcm,
} from '../../src/core/fractions';

describe('Wave 37 frac-findlcd — pairwise', () => {
  it('findLCD(a,b) equals lcm(da,db)', () => {
    for (let da = 1; da <= 15; da++) {
      for (let db = 1; db <= 15; db++) {
        const a = createFraction(1, da);
        const b = createFraction(1, db);
        expect(findLCD(a, b)).toBe(lcm(da, db));
      }
    }
  });

  it('findLCD single fraction returns its denominator', () => {
    for (let d = 1; d <= 20; d++) {
      expect(findLCD(createFraction(3, d))).toBe(d);
    }
  });
});
