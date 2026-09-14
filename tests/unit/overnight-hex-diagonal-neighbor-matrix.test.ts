/**
 * Overnight TOKENMAXX — diagonal neighbors + areNeighbors leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  getNeighbors,
  getNeighbor,
  getDiagonalNeighbors,
  areNeighbors,
  hexDistance,
  hexEquals,
  hexInArray,
} from '../../src/core/hex/coordinates';
import { createAxial } from '../../src/core/hex/types';

describe('Overnight hex — neighbors / diagonals', () => {
  it('six edge neighbors are distance 1; diagonals are distance 2', () => {
    const c = createAxial(1, -1);
    const edge = getNeighbors(c);
    expect(edge).toHaveLength(6);
    for (const n of edge) {
      expect(hexDistance(c, n)).toBe(1);
      expect(areNeighbors(c, n)).toBe(true);
    }
    const diag = getDiagonalNeighbors(c);
    expect(diag).toHaveLength(6);
    for (const d of diag) {
      expect(hexDistance(c, d)).toBe(2);
      expect(areNeighbors(c, d)).toBe(false);
      expect(hexInArray(d, edge)).toBe(false);
    }
  });

  it('getNeighbor cycles directions mod 6', () => {
    const c = createAxial(0, 0);
    expect(hexEquals(getNeighbor(c, 0), getNeighbor(c, 6))).toBe(true);
    expect(hexEquals(getNeighbor(c, 1), getNeighbor(c, 7))).toBe(true);
  });

  it('areNeighbors false for self and distance-2', () => {
    const a = createAxial(0, 0);
    expect(areNeighbors(a, a)).toBe(false);
    expect(areNeighbors(a, createAxial(2, 0))).toBe(false);
  });
});
