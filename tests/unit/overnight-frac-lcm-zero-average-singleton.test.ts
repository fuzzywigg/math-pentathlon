/**
 * Overnight TOKENMAXX HEAVY — lcm/gcd zero + average singleton leftovers.
 * After #214/#215. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  lcm,
  gcd,
  average,
  sum,
  createFraction,
  areEqual,
  fromWhole,
} from '../../src/core/fractions/arithmetic';

describe('Overnight frac — lcm zero + average singleton', () => {
  it('lcm with zero returns 0; gcd(0,n)=n', () => {
    expect(lcm(0, 5)).toBe(0);
    expect(lcm(4, 0)).toBe(0);
    expect(gcd(0, 12)).toBe(12);
    expect(gcd(12, 0)).toBe(12);
    expect(gcd(0, 0)).toBe(0);
  });

  it('average of singleton equals the fraction; empty sum is 0', () => {
    const f = createFraction(3, 7);
    expect(areEqual(average([f]), f)).toBe(true);
    expect(areEqual(sum([]), fromWhole(0))).toBe(true);
    expect(() => average([])).toThrow(/empty/i);
  });
});
