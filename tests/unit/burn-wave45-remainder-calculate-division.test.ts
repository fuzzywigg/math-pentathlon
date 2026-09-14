/**
 * Wave 45 TOKENMAXX — Remainder calculateDivision leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { calculateDivision } from '../../src/games/remainder-islands/rules';

describe('Wave 45 remainder — calculateDivision', () => {
  it('quotient/remainder identity for several pairs', () => {
    expect(calculateDivision(11, 3)).toEqual({
      dividend: 11,
      divisor: 3,
      quotient: 3,
      remainder: 2,
    });
    expect(calculateDivision(12, 4).remainder).toBe(0);
    expect(calculateDivision(7, 5).quotient).toBe(1);
  });
});
