/**
 * Wave 39 — cubeRound tie-break branch leftovers.
 * Beyond wave 29 hex. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { cubeRound, hexEquals, createAxial, hexRound } from '../../src/core/hex';

describe('Wave 39 hex — cubeRound ties', () => {
  it('integer cube rounds to itself', () => {
    expect(cubeRound({ x: 1, y: -1, z: 0 })).toEqual({ x: 1, y: -1, z: 0 });
  });

  it('xDiff-dominant branch reconstructs x', () => {
    // Fractional cube near (1,-0.4,-0.6) so xDiff largest after round
    const rounded = cubeRound({ x: 1.4, y: -0.4, z: -1.0 });
    expect(rounded.x + rounded.y + rounded.z).toBe(0);
  });

  it('yDiff > zDiff branch reconstructs y', () => {
    const rounded = cubeRound({ x: 0.2, y: 1.4, z: -1.6 });
    expect(rounded.x + rounded.y + rounded.z).toBe(0);
  });

  it('else branch reconstructs z', () => {
    const rounded = cubeRound({ x: 0.2, y: -0.3, z: 1.4 });
    expect(rounded.x + rounded.y + rounded.z).toBe(0);
  });

  it('hexRound matches axial integers', () => {
    const a = createAxial(2, -1);
    expect(hexEquals(hexRound(a), a)).toBe(true);
  });
});
