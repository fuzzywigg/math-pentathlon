/**
 * Overnight TOKENMAXX HEAVY — handshake dice subset × frac format leftovers.
 * After #214/#215. Distinct from fab/pinball/UI. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  getAllPossibleSums,
  getTwoDiceResults,
} from '../../src/core/dice/roller';
import {
  createFraction,
  formatFraction,
  add,
  areEqual,
} from '../../src/core/fractions/arithmetic';

describe('Overnight handshake — dice subset × frac format', () => {
  it('subset sums map to fraction totals over common denom', () => {
    const sums = getAllPossibleSums([1, 2, 3]);
    const asFrac = sums.map((s) => createFraction(s, 6));
    const total = asFrac.reduce((acc, f) => add(acc, f));
    // 1+2+3+4+5+6 = 21 → 21/6
    expect(areEqual(total, createFraction(21, 6))).toBe(true);
    expect(formatFraction(total, { simplify: true })).toBe('7/2');
  });

  it('two-dice product formats as improper mixed unicode when applicable', () => {
    const map = getTwoDiceResults(3, 3);
    expect(map.get('3 × 3')).toBe(9);
    expect(
      formatFraction(createFraction(9, 4), {
        showMixedNumber: true,
        useUnicodeFractions: true,
      })
    ).toBe('2 ¼');
  });
});
