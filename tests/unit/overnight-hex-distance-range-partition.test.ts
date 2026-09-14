/**
 * Overnight TOKENMAXX — hex distance/range partition leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexDistance, hexesInRange } from '../../src/core/hex/coordinates';
import { createAxial } from '../../src/core/hex/types';

describe('Overnight hex — distance range partition', () => {
  it('range R count is 3R(R+1)+1', () => {
    const c = createAxial(0, 0);
    for (let R = 0; R <= 5; R++) {
      expect(hexesInRange(c, R)).toHaveLength(3 * R * (R + 1) + 1);
    }
  });

  it('distance is symmetric and triangle-ish on samples', () => {
    const a = createAxial(0, 0);
    const b = createAxial(3, -1);
    const c = createAxial(-2, 4);
    expect(hexDistance(a, b)).toBe(hexDistance(b, a));
    expect(hexDistance(a, c)).toBeLessThanOrEqual(hexDistance(a, b) + hexDistance(b, c));
  });
});
