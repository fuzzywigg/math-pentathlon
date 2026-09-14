/**
 * Overnight TOKENMAXX — getNeighbor positive mod wrap (6/7/12).
 * Distinct from wave41 negative-index document. Tests-only. After #214/#215.
 */
import { describe, it, expect } from 'vitest';
import { getNeighbor, getNeighbors, hexEquals } from '../../src/core/hex/coordinates';
import { createAxial, AXIAL_DIRECTIONS } from '../../src/core/hex/types';

describe('Overnight core hex — neighbor positive mod', () => {
  it('direction 6 ≡ 0; 7 ≡ 1; 12 ≡ 0', () => {
    const o = createAxial(0, 0);
    expect(hexEquals(getNeighbor(o, 6), getNeighbor(o, 0))).toBe(true);
    expect(hexEquals(getNeighbor(o, 7), getNeighbor(o, 1))).toBe(true);
    expect(hexEquals(getNeighbor(o, 12), getNeighbor(o, 0))).toBe(true);
    expect(hexEquals(getNeighbor(o, 6), AXIAL_DIRECTIONS[0])).toBe(true);
  });

  it('getNeighbors matches directions 0..5', () => {
    const c = createAxial(3, -2);
    const all = getNeighbors(c);
    expect(all).toHaveLength(6);
    for (let i = 0; i < 6; i++) {
      expect(hexEquals(all[i], getNeighbor(c, i))).toBe(true);
    }
  });
});
