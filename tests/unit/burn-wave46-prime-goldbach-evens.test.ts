/**
 * Wave 46 — Prime Gold Goldbach even ladder leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { isGoldbachNumber } from '../../src/games/prime-gold/types';

describe('Wave 46 prime — Goldbach ladder', () => {
  it('8/12/28 true; 9/1 false', () => {
    expect(isGoldbachNumber(8)).toBe(true);
    expect(isGoldbachNumber(12)).toBe(true);
    expect(isGoldbachNumber(28)).toBe(true);
    expect(isGoldbachNumber(9)).toBe(false);
    expect(isGoldbachNumber(1)).toBe(false);
  });
});
