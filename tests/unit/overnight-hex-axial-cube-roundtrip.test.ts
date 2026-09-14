/**
 * Overnight TOKENMAXX — hex axial↔cube identity leftovers after #197.
 * Existing src/core/hex only. Tests-only. Not demos.
 */
import { describe, it, expect } from 'vitest';
import { axialToCube, cubeToAxial, hexEquals } from '../../src/core/hex/coordinates';
import { createAxial, createCube } from '../../src/core/hex/types';

describe('Overnight hex — axial/cube roundtrip lattice', () => {
  it('axial→cube→axial preserves q/r over a ring lattice', () => {
    for (let q = -4; q <= 4; q++) {
      for (let r = -4; r <= 4; r++) {
        if (Math.abs(q) + Math.abs(r) + Math.abs(-q - r) > 8) continue;
        const a = createAxial(q, r);
        const c = axialToCube(a);
        expect(c.x + c.y + c.z).toBe(0);
        expect(hexEquals(cubeToAxial(c), a)).toBe(true);
      }
    }
  });

  it('cube→axial→cube preserves x/z for valid cubes', () => {
    const samples = [
      createCube(0, 0, 0),
      createCube(2, -1, -1),
      createCube(-3, 1, 2),
      createCube(5, -2, -3),
    ];
    for (const c of samples) {
      const back = axialToCube(cubeToAxial(c));
      expect(back.x).toBe(c.x);
      expect(back.z).toBe(c.z);
      expect(back.x + back.y + back.z).toBe(0);
    }
  });
});
