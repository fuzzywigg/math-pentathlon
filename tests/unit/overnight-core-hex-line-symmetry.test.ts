/**
 * Overnight TOKENMAXX — hexLine reverse symmetry and unit steps.
 * Tests-only. After #214/#215.
 */
import { describe, it, expect } from 'vitest';
import {
  hexLine,
  hexDistance,
  hexEquals,
  areNeighbors,
} from '../../src/core/hex/coordinates';
import { createAxial } from '../../src/core/hex/types';

describe('Overnight core hex — line symmetry', () => {
  it('reverse line is reverse array; consecutive cells are neighbors', () => {
    const a = createAxial(-2, 3);
    const b = createAxial(4, -1);
    const fwd = hexLine(a, b);
    const rev = hexLine(b, a);
    expect(fwd).toHaveLength(hexDistance(a, b) + 1);
    expect(rev.map((h) => `${h.q},${h.r}`).reverse()).toEqual(
      fwd.map((h) => `${h.q},${h.r}`)
    );
    for (let i = 0; i < fwd.length - 1; i++) {
      expect(areNeighbors(fwd[i], fwd[i + 1])).toBe(true);
    }
  });

  it('self line is singleton', () => {
    const a = createAxial(9, -4);
    expect(hexLine(a, a)).toEqual([a]);
    expect(hexEquals(hexLine(a, a)[0], a)).toBe(true);
  });
});
