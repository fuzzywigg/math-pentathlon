/**
 * Overnight TOKENMAXX — cubeRound when two diffs tie falls through branches.
 * Beyond wave39 dedicated x/y/z dominant cases. Tests-only. After #214/#215.
 */
import { describe, it, expect } from 'vitest';
import { cubeRound, hexRound } from '../../src/core/hex/coordinates';

describe('Overnight core hex — cubeRound equal-ish diffs', () => {
  it('near-equidistant fractional cubes still satisfy x+y+z=0', () => {
    const samples = [
      { x: 0.5, y: -0.5, z: 0 },
      { x: 0.5, y: 0.5, z: -1 },
      { x: 1.5, y: -0.5, z: -1 },
      { x: -0.25, y: -0.25, z: 0.5 },
      { x: 2.2, y: -1.1, z: -1.1 },
    ];
    for (const c of samples) {
      const r = cubeRound(c);
      expect(r.x + r.y + r.z).toBe(0);
      expect(Number.isInteger(r.x) && Number.isInteger(r.y) && Number.isInteger(r.z)).toBe(
        true
      );
    }
  });

  it('hexRound of midpoints yields integers', () => {
    const r = hexRound({ q: 0.5, r: -0.5 });
    expect(Number.isInteger(r.q)).toBe(true);
    expect(Number.isInteger(r.r)).toBe(true);
  });
});
