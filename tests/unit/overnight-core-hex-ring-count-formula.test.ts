/**
 * Overnight TOKENMAXX — hexRing length = 6*radius; hexSpiral prefix rings.
 * Tests-only. After #214/#215.
 */
import { describe, it, expect } from 'vitest';
import {
  hexRing,
  hexSpiral,
  hexesInRange,
  hexDistance,
  hexEquals,
} from '../../src/core/hex/coordinates';
import { createAxial } from '../../src/core/hex/types';

describe('Overnight core hex — ring/spiral counts', () => {
  it('ring radius r has 6r cells; all at exact distance r', () => {
    const c = createAxial(1, -1);
    for (const r of [1, 2, 3, 5]) {
      const ring = hexRing(c, r);
      expect(ring).toHaveLength(6 * r);
      expect(ring.every((h) => hexDistance(c, h) === r)).toBe(true);
    }
  });

  it('spiral radius R equals range disk; ring0 is center', () => {
    const c = createAxial(0, 0);
    expect(hexRing(c, 0)).toEqual([c]);
    for (const R of [0, 1, 2, 4]) {
      const spiral = hexSpiral(c, R);
      const range = hexesInRange(c, R);
      expect(spiral).toHaveLength(range.length);
      expect(spiral).toHaveLength(3 * R * (R + 1) + 1);
      expect(hexEquals(spiral[0], c)).toBe(true);
    }
  });
});
