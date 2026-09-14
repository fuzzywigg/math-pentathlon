/**
 * Wave 41 — Frac Fact getOperationSymbol + formatFraction edges.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import {
  getOperationSymbol,
  formatFraction,
} from '../../src/games/frac-fact/rules';

describe('Wave 41 Frac Fact — symbol / format edges', () => {
  it('getOperationSymbol covers all four ops', () => {
    expect(getOperationSymbol('add')).toBe('+');
    expect(getOperationSymbol('subtract')).toBe('−');
    expect(getOperationSymbol('multiply')).toBe('×');
    expect(getOperationSymbol('divide')).toBe('÷');
  });

  it('formatFraction whole numbers omit slash', () => {
    expect(formatFraction({ numerator: 0, denominator: 1 })).toBe('0');
    expect(formatFraction({ numerator: 7, denominator: 1 })).toBe('7');
    expect(formatFraction({ numerator: -2, denominator: 1 })).toBe('-2');
  });

  it('formatFraction proper and improper keep slash', () => {
    expect(formatFraction({ numerator: 1, denominator: 2 })).toBe('1/2');
    expect(formatFraction({ numerator: 5, denominator: 3 })).toBe('5/3');
    expect(formatFraction({ numerator: 0, denominator: 4 })).toBe('0/4');
  });
});
