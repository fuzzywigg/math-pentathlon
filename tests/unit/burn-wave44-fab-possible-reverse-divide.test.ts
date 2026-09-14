/**
 * Wave 44 — Fab-a-Diffy getPossibleResults reverse divide / dedup leftovers.
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

describe('Wave 44 Fab — getPossibleResults reverse divide', () => {
  it('emits distinct forward and reverse divide results', () => {
    const a = bar('a', 1, 2);
    const b = bar('b', 1, 4);
    const results = getPossibleResults(a, b);
    const divs = results.filter((r) => r.operation === 'divide');
    expect(divs.length).toBe(2);
    const fwd = calculateResult(a.fraction, b.fraction, 'divide')!;
    const rev = calculateResult(b.fraction, a.fraction, 'divide')!;
    expect(divs.some((d) => areEquivalent(d.result, fwd))).toBe(true);
    expect(divs.some((d) => areEquivalent(d.result, rev))).toBe(true);
  });

  it('identical fractions → single divide result (1) after dedup', () => {
    const a = bar('a', 3, 7);
    const b = bar('b', 3, 7);
    const results = getPossibleResults(a, b);
    const divs = results.filter((r) => r.operation === 'divide');
    expect(divs).toHaveLength(1);
    expect(areEquivalent(divs[0].result, { numerator: 1, denominator: 1 })).toBe(
      true
    );
  });

  it('add/multiply appear once (no reverse branch)', () => {
    const a = bar('a', 1, 3);
    const b = bar('b', 1, 6);
    const results = getPossibleResults(a, b);
    expect(results.filter((r) => r.operation === 'add')).toHaveLength(1);
    expect(results.filter((r) => r.operation === 'multiply')).toHaveLength(1);
  });
});
