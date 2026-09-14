/**
 * Wave 40 — nextRotation/prevRotation wrap leftovers after #176.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { nextRotation, prevRotation } from '../../src/core/polyomino';

describe('Wave 40 poly — rotation wrap', () => {
  it('nextRotation(270) → 0; prevRotation(0) → 270', () => {
    expect(nextRotation(270)).toBe(0);
    expect(prevRotation(0)).toBe(270);
  });

  it('four nextRotation cycles; prev undoes next', () => {
    let r: 0 | 90 | 180 | 270 = 0;
    for (let i = 0; i < 4; i++) r = nextRotation(r);
    expect(r).toBe(0);
    expect(prevRotation(nextRotation(90))).toBe(90);
  });
});
