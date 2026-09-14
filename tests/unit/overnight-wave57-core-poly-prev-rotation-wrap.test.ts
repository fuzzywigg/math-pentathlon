/**
 * Overnight HEAVY leftover after #264 — prevRotation wraps 0 → 270.
 * Distinct from wave56 O canRotate false flags. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { nextRotation, prevRotation } from '../../src/core/polyomino';

describe('Wave 57 core poly — rotation wrap', () => {
  it('prev/next form an inverse cycle', () => {
    expect(prevRotation(0)).toBe(270);
    expect(nextRotation(270)).toBe(0);
    expect(nextRotation(0)).toBe(90);
    expect(prevRotation(90)).toBe(0);
  });
});
