/**
 * Wave 39 — hex neighbor mod wrap leftovers after #172/#173.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  getNeighbor,
  getDiagonalNeighbors,
  areNeighbors,
  hexEquals,
  createAxial,
} from '../../src/core/hex';

describe('Wave 39 hex — neighbor mod wrap', () => {
  it('direction 6 ≡ 0; 7 ≡ 1', () => {
    const c = createAxial(0, 0);
    expect(hexEquals(getNeighbor(c, 6), getNeighbor(c, 0))).toBe(true);
    expect(hexEquals(getNeighbor(c, 7), getNeighbor(c, 1))).toBe(true);
    expect(hexEquals(getNeighbor(c, 12), getNeighbor(c, 0))).toBe(true);
  });

  it('diagonal set disjoint from edge neighbors', () => {
    const c = createAxial(2, -1);
    const edges = [0, 1, 2, 3, 4, 5].map((d) => getNeighbor(c, d));
    const diags = getDiagonalNeighbors(c);
    for (const d of diags) {
      expect(edges.some((e) => hexEquals(e, d))).toBe(false);
      expect(areNeighbors(c, d)).toBe(false);
    }
    for (const e of edges) {
      expect(areNeighbors(c, e)).toBe(true);
    }
  });
});
