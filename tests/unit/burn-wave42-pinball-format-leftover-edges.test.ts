/**
 * Wave 42 — Fraction Pinball formatDecimal / formatFraction leftovers.
 * Beyond wave41 format edges. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  formatDecimal,
  formatFraction,
} from '../../src/games/fraction-pinball/rules';

describe('Wave 42 pinball — format leftovers', () => {
  it('formatDecimal rounds half-up style at 4dp boundary', () => {
    expect(formatDecimal(0.12344)).toBe('0.1234');
    expect(formatDecimal(0.12345)).toBe('0.1235');
    expect(formatDecimal(1.99995)).toBe('2');
  });

  it('formatDecimal keeps terminating tenths/hundredths', () => {
    expect(formatDecimal(0.2)).toBe('0.2');
    expect(formatDecimal(0.75)).toBe('0.75');
    expect(formatDecimal(1.25)).toBe('1.25');
  });

  it('formatFraction integer denom-1 vs improper slash', () => {
    expect(formatFraction({ numerator: 12, denominator: 1 })).toBe('12');
    expect(formatFraction({ numerator: 5, denominator: 2 })).toBe('5/2');
    expect(formatFraction({ numerator: 7, denominator: 8 })).toBe('7/8');
  });
});
