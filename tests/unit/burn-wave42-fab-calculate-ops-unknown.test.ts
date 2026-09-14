/**
 * Wave 42 — Fab-a-Diffy calculateResult four ops + unknown null. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { calculateResult } from '../../src/games/fab-a-diffy/rules';
import type { Fraction, FractionOperation } from '../../src/core/fractions/types';

describe('Wave 42 fab — calculateResult ops + unknown', () => {
  const a: Fraction = { numerator: 1, denominator: 2 };
  const b: Fraction = { numerator: 1, denominator: 4 };

  it('covers add subtract multiply divide', () => {
    expect(calculateResult(a, b, 'add')).toMatchObject({
      numerator: 3,
      denominator: 4,
    });
    expect(calculateResult(a, b, 'subtract')).toMatchObject({
      numerator: 1,
      denominator: 4,
    });
    expect(calculateResult(a, b, 'multiply')).toMatchObject({
      numerator: 1,
      denominator: 8,
    });
    expect(calculateResult(a, b, 'divide')).toMatchObject({
      numerator: 2,
      denominator: 1,
    });
  });

  it('unknown operation via cast returns null', () => {
    expect(
      calculateResult(a, b, 'modulo' as FractionOperation)
    ).toBeNull();
  });

  it('divide by zero numerator returns null', () => {
    expect(
      calculateResult(a, { numerator: 0, denominator: 1 }, 'divide')
    ).toBeNull();
  });
});
