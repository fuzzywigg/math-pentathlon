/**
 * Overnight TOKENMAXX — Fab calculateResult commutative leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { calculateResult, getPossibleResults } from '../../src/games/fab-a-diffy/rules';
import { areEquivalent } from '../../src/core/fractions/arithmetic';
import type { FractionBar } from '../../src/games/fab-a-diffy/types';

const bar = (id: string, n: number, d: number): FractionBar => ({
  id,
  fraction: { numerator: n, denominator: d },
  owner: null,
  used: false,
});

describe('Overnight fab — calculateResult ops', () => {
  it('add/mul commute; sub/div ordered', () => {
    const a = { numerator: 1, denominator: 2 };
    const b = { numerator: 1, denominator: 3 };
    expect(areEquivalent(calculateResult(a, b, 'add')!, calculateResult(b, a, 'add')!)).toBe(true);
    expect(areEquivalent(calculateResult(a, b, 'multiply')!, calculateResult(b, a, 'multiply')!)).toBe(true);
    expect(areEquivalent(calculateResult(a, b, 'subtract')!, { numerator: 1, denominator: 6 })).toBe(true);
    const rev = calculateResult(b, a, 'subtract')!;
    // simplify stores sign on isNegative; magnitude stays positive
    expect(rev.isNegative).toBe(true);
    expect(areEquivalent(rev, { numerator: 1, denominator: 6, isNegative: true })).toBe(true);
  });

  it('divide by zero numerator returns null', () => {
    expect(
      calculateResult({ numerator: 1, denominator: 2 }, { numerator: 0, denominator: 5 }, 'divide')
    ).toBeNull();
  });

  it('getPossibleResults includes reverse sub/div when non-negative', () => {
    const results = getPossibleResults(bar('a', 1, 2), bar('b', 1, 4));
    expect(results.some((r) => r.operation === 'subtract')).toBe(true);
    expect(results.every((r) => r.result.numerator >= 0)).toBe(true);
  });

  it('unknown op returns null', () => {
    expect(calculateResult({ numerator: 1, denominator: 2 }, { numerator: 1, denominator: 3 }, 'pow' as never)).toBeNull();
  });
});
