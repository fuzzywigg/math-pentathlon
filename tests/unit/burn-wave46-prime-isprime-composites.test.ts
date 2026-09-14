/**
 * Wave 46 — Prime Gold isPrime composites leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { isPrime } from '../../src/games/prime-gold/types';

describe('Wave 46 prime — composites', () => {
  it('rejects even composites and 25/49; accepts 3/5/7', () => {
    expect(isPrime(3)).toBe(true);
    expect(isPrime(5)).toBe(true);
    expect(isPrime(7)).toBe(true);
    expect(isPrime(4)).toBe(false);
    expect(isPrime(25)).toBe(false);
    expect(isPrime(49)).toBe(false);
  });
});
