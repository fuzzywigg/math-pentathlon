/**
 * Overnight TOKENMAXX HEAVY — renderFractionComparison dual-sign vs toDecimal leftover.
 * After #214/#215. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { renderFractionComparison } from '../../src/core/fractions/fraction-bar-ui';
import { compare } from '../../src/core/fractions/arithmetic';
import type { Fraction } from '../../src/core/fractions/types';

describe('Overnight frac-bar — comparison dual-sign operator mismatch', () => {
  it('conflict dual-sign can disagree with compare() operator', () => {
    const conflict: Fraction = {
      numerator: -1,
      denominator: 2,
      isNegative: true,
    };
    const zero: Fraction = { numerator: 0, denominator: 1 };
    // compare treats conflict as -1/2 → less than 0
    expect(compare(conflict, zero)).toBe(-1);
    // renderFractionComparison uses toDecimal → +0.5 → '>'
    const el = renderFractionComparison(conflict, zero, {
      style: 'horizontal',
      showLabel: false,
      width: 80,
      height: 24,
    });
    expect(el.querySelector('.operator')?.textContent).toBe('>');
  });

  it('plain negatives agree on <', () => {
    const el = renderFractionComparison(
      { numerator: -1, denominator: 2 },
      { numerator: 0, denominator: 1 },
      { showLabel: false }
    );
    expect(el.querySelector('.operator')?.textContent).toBe('<');
  });
});
