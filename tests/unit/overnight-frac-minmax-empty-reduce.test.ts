/**
 * Overnight TOKENMAXX HEAVY — min/max empty + toCommonDenominator empty leftover.
 * After #214/#215. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  min,
  max,
  toCommonDenominator,
  createFraction,
} from '../../src/core/fractions/arithmetic';

describe('Overnight frac — min/max empty reduce + common empty', () => {
  it('min/max with no args throw (reduce empty)', () => {
    expect(() => min()).toThrow();
    expect(() => max()).toThrow();
  });

  it('min/max singleton identity; toCommonDenominator() → []', () => {
    const f = createFraction(2, 9);
    expect(min(f)).toBe(f);
    expect(max(f)).toBe(f);
    expect(toCommonDenominator()).toEqual([]);
  });
});
