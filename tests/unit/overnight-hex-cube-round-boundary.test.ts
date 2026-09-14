/**
 * Overnight TOKENMAXX — cubeRound / hexRound near-boundary leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { cubeRound, hexRound, axialToCube } from '../../src/core/hex/coordinates';

describe('Overnight hex — rounding boundary bands', () => {
  it('cubeRound restores x+y+z=0 and nearest integers on fractional cubes', () => {
    const samples = [
      { x: 0.4, y: -0.3, z: -0.1 },
      { x: 1.6, y: -0.7, z: -0.9 },
      { x: -0.5, y: 0.2, z: 0.3 },
      { x: 2.1, y: -1.05, z: -1.05 },
    ];
    for (const c of samples) {
      const r = cubeRound(c);
      expect(r.x + r.y + r.z).toBe(0);
      expect(Number.isInteger(r.x)).toBe(true);
    }
  });

  it('hexRound on already-integer axial is identity', () => {
    for (const [q, r] of [[0, 0], [2, -1], [-4, 3]]) {
      expect(hexRound({ q, r })).toEqual({ q, r });
      expect(axialToCube({ q, r }).x + axialToCube({ q, r }).y + axialToCube({ q, r }).z).toBe(0);
    }
  });

  it('hexRound snaps fractional axial near midpoints', () => {
    const snapped = hexRound({ q: 0.6, r: -0.3 });
    expect(Number.isInteger(snapped.q)).toBe(true);
    expect(Number.isInteger(snapped.r)).toBe(true);
  });
});
