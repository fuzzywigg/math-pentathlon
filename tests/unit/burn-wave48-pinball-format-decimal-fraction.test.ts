/**
 * Wave 48 — Pinball formatDecimal/formatFraction edges. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { formatDecimal, formatFraction } from '../../src/games/fraction-pinball/rules';

describe('Wave 48 pinball — format helpers', () => {
  it('strips trailing zeros; whole denom-1', () => {
    expect(formatDecimal(0.5)).toBe('0.5');
    expect(formatDecimal(2)).toBe('2');
    expect(formatFraction({ numerator: 3, denominator: 1 })).toBe('3');
    expect(formatFraction({ numerator: 2, denominator: 5 })).toBe('2/5');
  });
});
