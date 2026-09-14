/**
 * Wave 43 TOKENMAXX — Fab getPossibleResults reverse-order leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getPossibleResults } from '../../src/games/fab-a-diffy/rules';
import type { FractionBar } from '../../src/games/fab-a-diffy/types';
import type { Fraction } from '../../src/core/fractions/types';

function bar(id: string, fraction: Fraction): FractionBar {
  return { id, fraction, owner: null, used: false };
}

describe('Wave 43 fab — possible results reverse', () => {
  it('includes reverse subtract/divide when distinct and non-negative', () => {
    const a = bar('a', { numerator: 1, denominator: 2 });
    const b = bar('b', { numerator: 1, denominator: 4 });
    const results = getPossibleResults(a, b);
    const ops = results.map((r) => r.operation);
    expect(ops).toContain('add');
    expect(ops).toContain('multiply');
    expect(ops.filter((o) => o === 'subtract').length).toBeGreaterThanOrEqual(1);
    expect(ops.filter((o) => o === 'divide').length).toBeGreaterThanOrEqual(1);
    for (const { result } of results) {
      expect(result.numerator).toBeGreaterThanOrEqual(0);
    }
  });

  it('filters to non-negative results only', () => {
    const small = bar('s', { numerator: 1, denominator: 8 });
    const big = bar('b', { numerator: 7, denominator: 8 });
    const results = getPossibleResults(small, big);
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((r) => r.result.numerator >= 0)).toBe(true);
    // reverse big-small subtract should be present as a non-negative path
    expect(
      results.some(
        (r) =>
          r.operation === 'subtract' &&
          r.result.numerator === 3 &&
          r.result.denominator === 4
      )
    ).toBe(true);
  });
});
