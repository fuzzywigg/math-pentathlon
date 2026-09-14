/**
 * Overnight TOKENMAXX HEAVY — fromMixedNumber negative whole + zero frac leftover.
 * After #214/#215. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  fromMixedNumber,
  toMixedNumber,
  toDecimal,
} from '../../src/core/fractions/arithmetic';

describe('Overnight frac — fromMixedNumber neg whole zero frac', () => {
  it('fromMixedNumber(-2, 0, 5) → -10/5 shape', () => {
    const f = fromMixedNumber(-2, 0, 5);
    expect(f).toEqual({ numerator: -10, denominator: 5 });
    expect(toDecimal(f)).toBe(-2);
    const mixed = toMixedNumber(f);
    expect(mixed.whole).toBe(-2);
    expect(mixed.fraction.numerator).toBe(0);
  });

  it('fromMixedNumber(-1, 1, 2) improper and decimal', () => {
    const f = fromMixedNumber(-1, 1, 2);
    expect(f).toEqual({ numerator: -3, denominator: 2 });
    expect(toDecimal(f)).toBe(-1.5);
  });
});
