/**
 * Wave 44 — Fab-a-Diffy getPossibleResults reverse subtract leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  getPossibleResults,
  calculateResult,
} from '../../src/games/fab-a-diffy/rules';
import type { FractionBar } from '../../src/games/fab-a-diffy/types';
import { areEquivalent } from '../../src/core/fractions/arithmetic';

function bar(id: string, n: number, d: number): FractionBar {
  return {
    id,
    fraction: { numerator: n, denominator: d },
    owner: null,
    used: false,
  };
}

describe('Wave 44 Fab — getPossibleResults reverse subtract', () => {
  it('includes both forward and reverse when both non-negative and distinct', () => {
    const a = bar('a', 1, 2);
    const b = bar('b', 1, 3);
    const results = getPossibleResults(a, b);
    const subs = results.filter((r) => r.operation === 'subtract');
    expect(subs.length).toBe(2);
    const forward = calculateResult(a.fraction, b.fraction, 'subtract')!;
    const reverse = calculateResult(b.fraction, a.fraction, 'subtract')!;
    expect(
      subs.some((s) => areEquivalent(s.result, forward))
    ).toBe(true);
    expect(
      subs.some((s) => areEquivalent(s.result, reverse))
    ).toBe(true);
  });

  it('forward underflow still has abs numerator; reverse is positive twin', () => {
    const small = bar('s', 1, 8);
    const large = bar('l', 7, 8);
    const results = getPossibleResults(small, large);
    const subs = results.filter((r) => r.operation === 'subtract');
    // simplify stores sign on isNegative, so numerator>=0 gate keeps both
    expect(subs.length).toBe(2);
    const forward = calculateResult(small.fraction, large.fraction, 'subtract')!;
    const reverse = calculateResult(large.fraction, small.fraction, 'subtract')!;
    expect(forward.isNegative).toBe(true);
    expect(reverse.isNegative ?? false).toBe(false);
    expect(areEquivalent(reverse, { numerator: 3, denominator: 4 })).toBe(true);
    expect(subs.some((s) => s.result.isNegative === true)).toBe(true);
  });

  it('identical fractions → single zero subtract (dedup reverse)', () => {
    const a = bar('a', 2, 5);
    const b = bar('b', 2, 5);
    const results = getPossibleResults(a, b);
    const zeros = results.filter(
      (r) =>
        r.operation === 'subtract' &&
        areEquivalent(r.result, { numerator: 0, denominator: 1 })
    );
    expect(zeros).toHaveLength(1);
  });
});
