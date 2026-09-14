/**
 * Wave 40 — formatMixedNumber / isSimplified / findEquivalentFractions leftovers after #176.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createFraction,
  formatMixedNumber,
  isSimplified,
  findEquivalentFractions,
} from '../../src/core/fractions';

describe('Wave 40 frac — mixed / simplified / equiv', () => {
  it('formatMixedNumber improper and whole', () => {
    expect(formatMixedNumber(createFraction(7, 3))).toMatch(/2/);
    expect(formatMixedNumber(createFraction(4, 2))).toBe('2');
    expect(formatMixedNumber(createFraction(1, 3))).toContain('1/3');
  });

  it('isSimplified false for 2/4; findEquivalentFractions n=0 empty', () => {
    expect(isSimplified({ numerator: 2, denominator: 4 })).toBe(false);
    expect(isSimplified(createFraction(1, 3))).toBe(true);
    expect(findEquivalentFractions(createFraction(1, 2), 0)).toEqual([]);
  });
});
