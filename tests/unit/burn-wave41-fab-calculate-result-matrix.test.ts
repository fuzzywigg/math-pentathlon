/**
 * Wave 41 — Fab-a-Diffy calculateResult op matrix leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { calculateResult } from '../../src/games/fab-a-diffy/rules';
import type { Fraction } from '../../src/core/fractions/types';

describe('Wave 41 fab-a-diffy — calculateResult matrix', () => {
  const half: Fraction = { numerator: 1, denominator: 2 };
  const third: Fraction = { numerator: 1, denominator: 3 };
  const quarter: Fraction = { numerator: 1, denominator: 4 };

  it('add / subtract / multiply simplify', () => {
    expect(calculateResult(half, half, 'add')).toMatchObject({
      numerator: 1,
      denominator: 1,
    });
    expect(calculateResult(half, third, 'subtract')).toMatchObject({
      numerator: 1,
      denominator: 6,
    });
    expect(calculateResult(half, quarter, 'multiply')).toMatchObject({
      numerator: 1,
      denominator: 8,
    });
  });

  it('divide yields reciprocal product', () => {
    expect(calculateResult(half, half, 'divide')).toMatchObject({
      numerator: 1,
      denominator: 1,
    });
    expect(calculateResult(half, quarter, 'divide')).toMatchObject({
      numerator: 2,
      denominator: 1,
    });
  });

  it('subtract can produce zero', () => {
    expect(calculateResult(third, third, 'subtract')).toMatchObject({
      numerator: 0,
      denominator: 1,
    });
  });
});
