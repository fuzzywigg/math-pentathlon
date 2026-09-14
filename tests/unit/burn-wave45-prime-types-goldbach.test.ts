/**
 * Wave 45 — Prime Gold isGoldbachNumber leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { isGoldbachNumber } from '../../src/games/prime-gold/types';

describe('Wave 45 prime — Goldbach', () => {
  it('even >2 true; odds and <=2 false', () => {
    expect(isGoldbachNumber(10)).toBe(true);
    expect(isGoldbachNumber(4)).toBe(true);
    expect(isGoldbachNumber(3)).toBe(false);
    expect(isGoldbachNumber(2)).toBe(false);
  });
});
