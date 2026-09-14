/**
 * Overnight TOKENMAXX HEAVY — toDecimal conflicting dual-sign leftover.
 * After #214/#215. Tests-only. Not pinball.
 */
import { describe, it, expect } from 'vitest';
import {
  toDecimal,
  areEqual,
  compare,
  simplify,
} from '../../src/core/fractions/arithmetic';
import type { Fraction } from '../../src/core/fractions/types';

describe('Overnight frac — toDecimal conflicting dual signs', () => {
  it('numerator already negative + isNegative:true → toDecimal flips twice (+)', () => {
    const conflict: Fraction = {
      numerator: -3,
      denominator: 4,
      isNegative: true,
    };
    // toDecimal: value = -3/4, then isNegative → -value = +0.75
    expect(toDecimal(conflict)).toBe(0.75);
    // compare/areEqual use signedNumerator → -Math.abs → treat as -3/4
    expect(areEqual(conflict, { numerator: -3, denominator: 4 })).toBe(true);
    expect(compare(conflict, { numerator: 0, denominator: 1 })).toBe(-1);
    expect(simplify(conflict)).toEqual({
      numerator: 3,
      denominator: 4,
      isNegative: true,
    });
  });
});
