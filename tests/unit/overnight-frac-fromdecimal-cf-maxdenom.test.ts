/**
 * Overnight TOKENMAXX HEAVY — fromDecimal continued-fraction maxDenom leftover.
 * After #214/#215. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  fromDecimal,
  toDecimal,
  areEqual,
  createFraction,
} from '../../src/core/fractions/arithmetic';

describe('Overnight frac — fromDecimal continued-fraction path', () => {
  it('maxDenominator is a soft loop guard — final k1 may overshoot', () => {
    // 1/√2 ≈ 0.7071… — not in commonDenoms exact table
    const f = fromDecimal(Math.SQRT1_2, 10);
    // Loop exits when k1 exceeds max after an iteration — soft bound leftover
    expect(f.denominator).toBe(17);
    expect(Math.abs(toDecimal(f) - Math.SQRT1_2)).toBeLessThan(0.01);
  });

  it('common denom fast-path for 0.125 → 1/8', () => {
    expect(fromDecimal(0.125)).toEqual(
      expect.objectContaining({ numerator: 1, denominator: 8 })
    );
    expect(areEqual(fromDecimal(0.125), createFraction(1, 8))).toBe(true);
  });

  it('negative non-integer preserves sign via simplify', () => {
    const f = fromDecimal(-0.375);
    expect(f.isNegative).toBe(true);
    expect(areEqual(f, createFraction(-3, 8))).toBe(true);
  });
});
