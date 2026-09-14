/**
 * Wave 44 — fab possible results × dice getTwoDiceResults handshake. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getPossibleResults, calculateResult } from '../../src/games/fab-a-diffy/rules';
import { getTwoDiceResults } from '../../src/core/dice';
import { toDecimal } from '../../src/core/fractions';

describe('Wave 44 handshake — fab × dice two-ops', () => {
  it('integer fraction bars mirror dice integer ops', () => {
    const bar1 = {
      id: 'a',
      fraction: { numerator: 6, denominator: 1 },
      owner: null,
      used: false,
    };
    const bar2 = {
      id: 'b',
      fraction: { numerator: 3, denominator: 1 },
      owner: null,
      used: false,
    };
    const possibles = getPossibleResults(bar1, bar2);
    const dice = getTwoDiceResults(6, 3);
    const add = calculateResult(bar1.fraction, bar2.fraction, 'add');
    expect(toDecimal(add!)).toBe(dice.get('6 + 3'));
    expect(possibles.some((p) => p.operation === 'multiply')).toBe(true);
    expect(dice.get('6 × 3')).toBe(18);
  });
});
