/**
 * Wave 45 — Prime Gold isPrime edge leftovers after #208. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { isPrime } from '../../src/games/prime-gold/types';

describe('Wave 45 prime — isPrime edges', () => {
  it('rejects <2, composites; accepts 2 and odds', () => {
    expect(isPrime(0)).toBe(false);
    expect(isPrime(1)).toBe(false);
    expect(isPrime(2)).toBe(true);
    expect(isPrime(9)).toBe(false);
    expect(isPrime(47)).toBe(true);
  });
});
