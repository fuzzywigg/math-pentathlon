/**
 * Overnight TOKENMAXX — hexSpiral partitions into rings without overlap.
 * Tests-only. After #214/#215.
 */
import { describe, it, expect } from 'vitest';
import { hexSpiral, hexRing, hexDistance } from '../../src/core/hex/coordinates';
import { createAxial, coordKey } from '../../src/core/hex/types';

describe('Overnight core hex — spiral ring partition', () => {
  it('spiral cells unique; ring r subset equals distance==r', () => {
    const c = createAxial(0, 0);
    const R = 4;
    const spiral = hexSpiral(c, R);
    const keys = spiral.map((h) => coordKey(h));
    expect(new Set(keys).size).toBe(keys.length);
    for (let r = 1; r <= R; r++) {
      const ring = hexRing(c, r);
      const atDist = spiral.filter((h) => hexDistance(c, h) === r);
      expect(atDist).toHaveLength(6 * r);
      expect(new Set(ring.map((h) => coordKey(h)))).toEqual(
        new Set(atDist.map((h) => coordKey(h)))
      );
    }
  });
});
