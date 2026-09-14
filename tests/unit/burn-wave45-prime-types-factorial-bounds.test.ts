/**
 * Wave 45 — Prime Gold factorial bounds leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { factorial } from '../../src/games/prime-gold/types';

describe('Wave 45 prime — factorial', () => {
  it('0/1 → 1; 5 → 120; out-of-range → NaN', () => {
    expect(factorial(0)).toBe(1);
    expect(factorial(1)).toBe(1);
    expect(factorial(5)).toBe(120);
    expect(factorial(-1)).toBeNaN();
    expect(factorial(11)).toBeNaN();
  });
});
