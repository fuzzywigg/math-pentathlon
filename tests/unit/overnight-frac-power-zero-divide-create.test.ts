/**
 * Overnight TOKENMAXX HEAVY — power(0) + divide-by-zero + createFraction denom flip leftovers.
 * After #214/#215. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  power,
  divide,
  createFraction,
  fromWhole,
  areEqual,
} from '../../src/core/fractions/arithmetic';

describe('Overnight frac — power zero + divide/create edges', () => {
  it('power any fraction to 0 is 1', () => {
    expect(power(createFraction(3, 7), 0)).toEqual(fromWhole(1));
    expect(
      areEqual(power({ numerator: 2, denominator: 5, isNegative: true }, 0), fromWhole(1))
    ).toBe(true);
  });

  it('divide by zero numerator throws; createFraction flips negative denom', () => {
    expect(() => divide(createFraction(1, 2), createFraction(0, 3))).toThrow(
      /zero/i
    );
    expect(createFraction(3, -4)).toEqual({ numerator: -3, denominator: 4 });
    expect(() => createFraction(1, 0)).toThrow(/zero/i);
  });
});
