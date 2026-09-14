/**
 * Wave 44 overnight HEAVY — Fab subtract reverse path for ordered pairs.
 */
import { describe, it, expect } from 'vitest';
import { getPossibleResults, calculateResult } from '../../src/games/fab-a-diffy/rules';
import type { FractionBar } from '../../src/games/fab-a-diffy/types';

describe('Wave 44 fab — subtract reverse path', () => {
  it('includes reverse 7/8−1/8 = 3/4 among possibles', () => {
    const a: FractionBar = {
      id: 'a',
      fraction: { numerator: 1, denominator: 8 },
      owner: null,
      used: false,
    };
    const b: FractionBar = {
      id: 'b',
      fraction: { numerator: 7, denominator: 8 },
      owner: null,
      used: false,
    };
    // Forward small−large may carry isNegative; reverse is the teaching path.
    const forward = calculateResult(a.fraction, b.fraction, 'subtract');
    expect(forward).not.toBeNull();
    const results = getPossibleResults(a, b);
    expect(
      results.some(
        (r) =>
          r.operation === 'subtract' &&
          r.result.numerator === 3 &&
          r.result.denominator === 4
      )
    ).toBe(true);
    expect(results.every((r) => r.result.numerator >= 0)).toBe(true);
  });
});
