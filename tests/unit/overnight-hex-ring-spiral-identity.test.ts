/**
 * Overnight TOKENMAXX — hexRing / hexSpiral / range leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  hexRing,
  hexSpiral,
  hexesInRange,
  hexDistance,
  hexEquals,
  hexInArray,
} from '../../src/core/hex/coordinates';
import { createAxial } from '../../src/core/hex/types';

describe('Overnight hex — ring/spiral/range identities', () => {
  it('radius-0 ring is center; spiral radius R covers range', () => {
    const c = createAxial(2, -1);
    expect(hexRing(c, 0)).toEqual([c]);
    const spiral = hexSpiral(c, 3);
    const range = hexesInRange(c, 3);
    expect(spiral).toHaveLength(range.length);
    for (const h of range) {
      expect(hexInArray(h, spiral)).toBe(true);
      expect(hexDistance(c, h)).toBeLessThanOrEqual(3);
    }
  });

  it('ring radius r has 6r cells all at distance r', () => {
    const c = createAxial(0, 0);
    for (let r = 1; r <= 4; r++) {
      const ring = hexRing(c, r);
      expect(ring).toHaveLength(6 * r);
      for (const h of ring) expect(hexDistance(c, h)).toBe(r);
    }
  });

  it('spiral starts at center', () => {
    const c = createAxial(-2, 3);
    expect(hexEquals(hexSpiral(c, 2)[0], c)).toBe(true);
  });
});
