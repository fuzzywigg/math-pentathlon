/**
 * Wave 41 — Fraction Pinball formatDecimal / formatFraction edges.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import {
  formatDecimal,
  formatFraction,
} from '../../src/games/fraction-pinball/rules';

describe('Wave 41 Pinball — format edges', () => {
  it('formatDecimal keeps integers and strips trailing zeros', () => {
    expect(formatDecimal(0)).toBe('0');
    expect(formatDecimal(1)).toBe('1');
    expect(formatDecimal(2.0)).toBe('2');
    expect(formatDecimal(0.5)).toBe('0.5');
    expect(formatDecimal(0.25)).toBe('0.25');
    expect(formatDecimal(0.125)).toBe('0.125');
  });

  it('formatDecimal rounds to at most 4 decimal places', () => {
    expect(formatDecimal(1 / 3)).toMatch(/^0\.3333/);
    expect(formatDecimal(0.123456)).toBe('0.1235');
    expect(formatDecimal(0.99999)).toBe('1');
  });

  it('formatFraction whole vs slash edges', () => {
    expect(formatFraction({ numerator: 0, denominator: 1 })).toBe('0');
    expect(formatFraction({ numerator: 9, denominator: 1 })).toBe('9');
    expect(formatFraction({ numerator: 2, denominator: 5 })).toBe('2/5');
    expect(formatFraction({ numerator: 8, denominator: 3 })).toBe('8/3');
  });
});
