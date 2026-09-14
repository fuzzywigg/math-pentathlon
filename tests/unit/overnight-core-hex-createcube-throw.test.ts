/**
 * Overnight TOKENMAXX — createCube rejects x+y+z ≠ 0.
 * Tests-only. After #214/#215.
 */
import { describe, it, expect } from 'vitest';
import { createCube, createAxial, createOffset, coordKey, parseCoordKey } from '../../src/core/hex/types';
import { axialToCube, cubeToAxial } from '../../src/core/hex/coordinates';

describe('Overnight core hex — createCube throw / factories', () => {
  it('throws Invalid cube when sum ≠ 0', () => {
    expect(() => createCube(1, 0, 0)).toThrow(/Invalid cube/);
    expect(() => createCube(1, 1, 1)).toThrow(/Invalid cube/);
    expect(() => createCube(-2, 0, 1)).toThrow(/Invalid cube/);
  });

  it('valid cubes round-trip through axial', () => {
    const cube = createCube(2, -3, 1);
    expect(cube).toEqual({ x: 2, y: -3, z: 1 });
    expect(axialToCube(cubeToAxial(cube))).toEqual(cube);
  });

  it('createAxial / createOffset / coordKey negatives', () => {
    expect(createAxial(-4, 7)).toEqual({ q: -4, r: 7 });
    expect(createOffset(3, -1)).toEqual({ col: 3, row: -1 });
    const k = coordKey({ q: -2, r: 5 });
    expect(k).toBe('-2,5');
    expect(parseCoordKey(k)).toEqual({ q: -2, r: 5 });
    expect(parseCoordKey(coordKey(createAxial(0, 0)))).toEqual({ q: 0, r: 0 });
  });
});
