/**
 * Wave 40 — hexInArray + diagonal neighbors leftovers after #176.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createAxial,
  getNeighbors,
  getDiagonalNeighbors,
  areNeighbors,
  hexInArray,
  hexDistance,
} from '../../src/core/hex';

describe('Wave 40 hex — inArray / diagonal neighbors', () => {
  const c = createAxial(0, 0);

  it('hexInArray finds neighbors and misses ghosts', () => {
    const ring = getNeighbors(c);
    expect(hexInArray(ring[2], ring)).toBe(true);
    expect(hexInArray(createAxial(9, 9), ring)).toBe(false);
  });

  it('diagonals are distance 2 and not edge-neighbors', () => {
    const diags = getDiagonalNeighbors(c);
    expect(diags).toHaveLength(6);
    for (const d of diags) {
      expect(hexDistance(c, d)).toBe(2);
      expect(areNeighbors(c, d)).toBe(false);
    }
  });
});
