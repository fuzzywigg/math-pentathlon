/**
 * Wave 44 overnight HEAVY — Fab getPossibleResults reverse non-commutative.
 */
import { describe, it, expect } from 'vitest';
import { getPossibleResults } from '../../src/games/fab-a-diffy/rules';
import type { FractionBar } from '../../src/games/fab-a-diffy/types';

describe('Wave 44 fab — possible results reverse', () => {
  it('includes reverse subtract when positive', () => {
    const a: FractionBar = { id: 'a', fraction: { numerator: 1, denominator: 4 }, owner: null, used: false };
    const b: FractionBar = { id: 'b', fraction: { numerator: 3, denominator: 4 }, owner: null, used: false };
    const results = getPossibleResults(a, b);
    const ops = results.map((r) => r.operation);
    expect(ops).toContain('subtract');
    expect(ops).toContain('add');
    expect(ops).toContain('multiply');
    // 3/4 - 1/4 = 1/2 should appear via reverse
    expect(results.some((r) => r.result.numerator === 1 && r.result.denominator === 2)).toBe(true);
  });
});
