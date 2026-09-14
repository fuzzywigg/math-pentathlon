/**
 * Wave 42 — Fab-a-Diffy getPossibleResults reverse subtract/divide. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  getPossibleResults,
  calculateResult,
} from '../../src/games/fab-a-diffy/rules';
import type { FractionBar } from '../../src/games/fab-a-diffy/types';
import { areEquivalent } from '../../src/core/fractions/arithmetic';

describe('Wave 42 fab — possible reverse ops', () => {
  const half: FractionBar = {
    id: 'half',
    fraction: { numerator: 1, denominator: 2 },
    owner: null,
    used: false,
  };
  const eighth: FractionBar = {
    id: 'eighth',
    fraction: { numerator: 1, denominator: 8 },
    owner: null,
    used: false,
  };

  it('includes reverse subtract when order matters', () => {
    const results = getPossibleResults(eighth, half);
    const forward = calculateResult(eighth.fraction, half.fraction, 'subtract');
    const reverse = calculateResult(half.fraction, eighth.fraction, 'subtract');
    expect(reverse).not.toBeNull();
    expect(reverse!.numerator).toBeGreaterThanOrEqual(0);
    // reverse 1/2 - 1/8 = 3/8 should be present
    expect(
      results.some(
        (r) =>
          r.operation === 'subtract' &&
          areEquivalent(r.result, reverse!)
      )
    ).toBe(true);
    if (forward && forward.numerator >= 0) {
      expect(
        results.some(
          (r) =>
            r.operation === 'subtract' &&
            areEquivalent(r.result, forward)
        )
      ).toBe(true);
    }
  });

  it('includes reverse divide result when distinct', () => {
    const results = getPossibleResults(half, eighth);
    const reverse = calculateResult(eighth.fraction, half.fraction, 'divide');
    expect(reverse).not.toBeNull();
    expect(
      results.some(
        (r) =>
          r.operation === 'divide' && areEquivalent(r.result, reverse!)
      )
    ).toBe(true);
  });
});
