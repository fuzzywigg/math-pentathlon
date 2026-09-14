/**
 * Overnight TOKENMAXX — Frac-Fact formatFraction leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { formatFraction, getOperationSymbol } from '../../src/games/frac-fact/rules';

describe('Overnight frac-fact — format helpers', () => {
  it('whole and fraction forms; op symbols', () => {
    expect(formatFraction({ numerator: 0, denominator: 1 })).toBe('0');
    expect(formatFraction({ numerator: 0, denominator: 2 })).toBe('0/2');
    expect(formatFraction({ numerator: 3, denominator: 4 })).toBe('3/4');
    expect(getOperationSymbol('add')).toBe('+');
    expect(getOperationSymbol('subtract')).toBe('−');
    expect(getOperationSymbol('multiply')).toBe('×');
    expect(getOperationSymbol('divide')).toBe('÷');
  });
});
