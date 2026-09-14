/**
 * Wave 42 — Prime Gold factorial leftovers after #186. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { factorial } from '../../src/games/prime-gold/types';

describe('Wave 42 prime — factorial', () => {
  it('defines 0! and 1! as 1', () => {
    expect(factorial(0)).toBe(1);
    expect(factorial(1)).toBe(1);
  });

  it('computes small factorials 2 through 5', () => {
    expect(factorial(2)).toBe(2);
    expect(factorial(3)).toBe(6);
    expect(factorial(4)).toBe(24);
    expect(factorial(5)).toBe(120);
  });

  it('returns NaN for negatives and values above 10', () => {
    expect(Number.isNaN(factorial(-1))).toBe(true);
    expect(Number.isNaN(factorial(11))).toBe(true);
  });
});
