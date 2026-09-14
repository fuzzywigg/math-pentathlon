/**
 * Overnight TOKENMAXX — getNeighbor direction table leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getNeighbor, getNeighbors, hexEquals } from '../../src/core/hex/coordinates';
import { createAxial, AXIAL_DIRECTIONS } from '../../src/core/hex/types';

describe('Overnight hex — direction table', () => {
  it('getNeighbors matches AXIAL_DIRECTIONS offsets', () => {
    const c = createAxial(5, -2);
    const ns = getNeighbors(c);
    expect(ns).toHaveLength(AXIAL_DIRECTIONS.length);
    for (let i = 0; i < 6; i++) {
      expect(hexEquals(getNeighbor(c, i), ns[i])).toBe(true);
      expect(ns[i]).toEqual(
        createAxial(c.q + AXIAL_DIRECTIONS[i].q, c.r + AXIAL_DIRECTIONS[i].r)
      );
    }
  });
});
