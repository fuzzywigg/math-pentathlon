/**
 * Wave 39 — findLCD / toCommonDenominator empty leftovers after #172/#173.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  findLCD,
  toCommonDenominator,
  createFraction,
} from '../../src/core/fractions';

describe('Wave 39 frac — lcd empty common', () => {
  it('findLCD() → 1; toCommonDenominator() → []', () => {
    expect(findLCD()).toBe(1);
    expect(toCommonDenominator()).toEqual([]);
  });

  it('single-arg LCD equals that denominator', () => {
    const f = createFraction(2, 15);
    expect(findLCD(f)).toBe(15);
    expect(toCommonDenominator(f)).toEqual([
      { numerator: 2, denominator: 15 },
    ]);
  });
});
