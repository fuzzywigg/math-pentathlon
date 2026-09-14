/**
 * Overnight TOKENMAXX — diagonal cells are not areNeighbors.
 * Tests-only. After #214/#215.
 */
import { describe, it, expect } from 'vitest';
import {
  areNeighbors,
  getDiagonalNeighbors,
  getNeighbors,
  hexDistance,
} from '../../src/core/hex/coordinates';
import { createAxial } from '../../src/core/hex/types';

describe('Overnight core hex — diagonal not neighbors', () => {
  it('every diagonal fails areNeighbors and sits at distance 2', () => {
    const c = createAxial(2, -1);
    for (const d of getDiagonalNeighbors(c)) {
      expect(areNeighbors(c, d)).toBe(false);
      expect(hexDistance(c, d)).toBe(2);
    }
  });

  it('every edge neighbor passes areNeighbors at distance 1', () => {
    const c = createAxial(-3, 4);
    for (const n of getNeighbors(c)) {
      expect(areNeighbors(c, n)).toBe(true);
      expect(areNeighbors(n, c)).toBe(true);
      expect(hexDistance(c, n)).toBe(1);
    }
  });
});
