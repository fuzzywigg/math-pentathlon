/**
 * Wave 46 — Prime Gold factorial mid-range leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { factorial } from '../../src/games/prime-gold/types';

describe('Wave 46 prime — factorial mid', () => {
  it('3!=6, 4!=24, 6!=720', () => {
    expect(factorial(3)).toBe(6);
    expect(factorial(4)).toBe(24);
    expect(factorial(6)).toBe(720);
  });
});
