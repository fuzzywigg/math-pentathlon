/**
 * Wave 45 TOKENMAXX — Pinball formatDecimal/Fraction leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { formatDecimal, formatFraction } from '../../src/games/fraction-pinball/rules';

describe('Wave 45 pinball — format helpers', () => {
  it('trims integers and formats fractions', () => {
    expect(formatDecimal(2)).toBe('2');
    expect(formatDecimal(0.5)).toBe('0.5');
    expect(formatFraction({ numerator: 3, denominator: 1 })).toBe('3');
    expect(formatFraction({ numerator: 1, denominator: 4 })).toBe('1/4');
  });
});
