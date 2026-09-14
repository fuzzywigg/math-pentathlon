/**
 * Overnight TOKENMAXX HEAVY — performOperation same-denom subtract simplify step leftover.
 * After #214/#215. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  performOperation,
  createFraction,
} from '../../src/core/fractions/arithmetic';

describe('Overnight frac — perform same-denom subtract simplify step', () => {
  it('3/4−1/4 skips LCD but emits simplified step', () => {
    const r = performOperation(
      createFraction(3, 4),
      createFraction(1, 4),
      'subtract'
    );
    expect(r.steps).toBeDefined();
    expect(r.steps!.some((s) => s.includes('common denominator'))).toBe(
      false
    );
    expect(r.result).toEqual({ numerator: 2, denominator: 4 });
    expect(r.simplified).toEqual({
      numerator: 1,
      denominator: 2,
      isNegative: false,
    });
    expect(r.steps!.some((s) => s.includes('(simplified)'))).toBe(true);
    expect(r.decimal).toBe(0.5);
  });

  it('same-denom add auto-simplifies without LCD line', () => {
    const r = performOperation(
      createFraction(1, 4),
      createFraction(1, 4),
      'add'
    );
    expect(r.steps!.some((s) => s.includes('common denominator'))).toBe(
      false
    );
    expect(r.simplified).toEqual({
      numerator: 1,
      denominator: 2,
      isNegative: false,
    });
  });
});
