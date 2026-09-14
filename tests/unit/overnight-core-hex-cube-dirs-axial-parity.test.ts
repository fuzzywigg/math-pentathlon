/**
 * Overnight TOKENMAXX — CUBE_DIRECTIONS ↔ AXIAL_DIRECTIONS via axialToCube.
 * Tests-only. After #214/#215.
 */
import { describe, it, expect } from 'vitest';
import { axialToCube, cubeToAxial, hexEquals } from '../../src/core/hex/coordinates';
import {
  AXIAL_DIRECTIONS,
  CUBE_DIRECTIONS,
  CUBE_DIAGONALS,
  DIRECTION_NAMES,
  createAxial,
} from '../../src/core/hex/types';

describe('Overnight core hex — cube/axial dir parity', () => {
  it('each AXIAL_DIRECTIONS maps to matching CUBE_DIRECTIONS entry', () => {
    expect(AXIAL_DIRECTIONS).toHaveLength(6);
    expect(CUBE_DIRECTIONS).toHaveLength(6);
    expect(DIRECTION_NAMES).toHaveLength(6);
    for (let i = 0; i < 6; i++) {
      expect(axialToCube(AXIAL_DIRECTIONS[i])).toEqual(CUBE_DIRECTIONS[i]);
      expect(
        hexEquals(cubeToAxial(CUBE_DIRECTIONS[i]), AXIAL_DIRECTIONS[i])
      ).toBe(true);
    }
  });

  it('CUBE_DIAGONALS sum to 0 and sit at cube distance 2', () => {
    const o = createAxial(0, 0);
    for (const d of CUBE_DIAGONALS) {
      expect(d.x + d.y + d.z).toBe(0);
      const axial = cubeToAxial(d);
      const dist = Math.max(
        Math.abs(d.x),
        Math.abs(d.y),
        Math.abs(d.z)
      );
      expect(dist).toBe(2);
      expect(hexEquals(axial, o)).toBe(false);
    }
  });
});
