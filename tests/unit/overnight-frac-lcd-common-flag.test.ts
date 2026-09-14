/**
 * Overnight TOKENMAXX HEAVY — toCommonDenominator + findLCD empty/singleton leftovers.
 * After #214/#215. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  toCommonDenominator,
  findLCD,
  createFraction,
} from '../../src/core/fractions/arithmetic';
import type { Fraction } from '../../src/core/fractions/types';

describe('Overnight frac — LCD empty/singleton + common denom flag', () => {
  it('findLCD() with no args defaults to 1', () => {
    expect(findLCD()).toBe(1);
    expect(findLCD(createFraction(1, 8))).toBe(8);
  });

  it('toCommonDenominator expands flag-negatives via toStandardForm', () => {
    const a: Fraction = { numerator: 1, denominator: 2, isNegative: true };
    const b = createFraction(1, 3);
    const [ca, cb] = toCommonDenominator(a, b);
    expect(ca).toEqual({ numerator: -3, denominator: 6 });
    expect(cb).toEqual({ numerator: 2, denominator: 6 });
  });
});
