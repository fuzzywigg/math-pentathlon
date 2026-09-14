/**
 * Wave 44 — Fab-a-Diffy calculateResult edge + getOperationSymbol leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  calculateResult,
  getOperationSymbol,
} from '../../src/games/fab-a-diffy/rules';

describe('Wave 44 Fab — calculateResult / symbols edges', () => {
  it('subtract underflow keeps abs numerator and isNegative flag', () => {
    const r = calculateResult(
      { numerator: 1, denominator: 8 },
      { numerator: 7, denominator: 8 },
      'subtract'
    );
    expect(r).not.toBeNull();
    expect(r!.numerator).toBe(3);
    expect(r!.denominator).toBe(4);
    expect(r!.isNegative).toBe(true);
  });

  it('multiply by zero yields zero', () => {
    expect(
      calculateResult(
        { numerator: 3, denominator: 5 },
        { numerator: 0, denominator: 1 },
        'multiply'
      )
    ).toMatchObject({ numerator: 0, denominator: 1 });
  });

  it('getOperationSymbol covers all four ops distinctly', () => {
    const symbols = (['add', 'subtract', 'multiply', 'divide'] as const).map(
      getOperationSymbol
    );
    expect(new Set(symbols).size).toBe(4);
    expect(symbols).toEqual(['+', '−', '×', '÷']);
  });

  it('divide whole by half → 2', () => {
    expect(
      calculateResult(
        { numerator: 1, denominator: 1 },
        { numerator: 1, denominator: 2 },
        'divide'
      )
    ).toMatchObject({ numerator: 2, denominator: 1 });
  });
});
