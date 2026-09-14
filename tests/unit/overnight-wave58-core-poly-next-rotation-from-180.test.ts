/**
 * Overnight HEAVY leftover after #274 — nextRotation(180) → 270.
 * Distinct from wave57 prevRotation wrap 0→270. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { nextRotation, prevRotation } from '../../src/core/polyomino';

describe('Wave 58 core poly — nextRotation from 180', () => {
  it('180 advances to 270; prev returns to 180', () => {
    expect(nextRotation(180)).toBe(270);
    expect(prevRotation(270)).toBe(180);
  });
});
