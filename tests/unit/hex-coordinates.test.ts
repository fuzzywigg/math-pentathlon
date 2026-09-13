/**
 * Hex Coordinates Unit Tests
 * Covers src/core/hex/coordinates.ts (#9)
 */

import { describe, it, expect } from 'vitest';
import {
  axialToCube,
  cubeToAxial,
  axialToOffset,
  offsetToAxial,
  axialToPixel,
  axialToPixelPointy,
  axialToPixelFlat,
  pixelToAxial,
  pixelToAxialPointy,
  pixelToAxialFlat,
  cubeRound,
  hexRound,
  getNeighbors,
  getNeighbor,
  getDiagonalNeighbors,
  areNeighbors,
  hexDistance,
  hexesInRange,
  hexRing,
  hexSpiral,
  hexLine,
  rotateRight,
  rotateLeft,
  rotateAround,
  reflect,
  hexEquals,
  hexInArray,
  createAxial,
  createCube,
  createLayout,
} from '../../src/core/hex';

describe('coordinate conversions', () => {
  it('round-trips axial ↔ cube', () => {
    const axial = createAxial(2, -1);
    const cube = axialToCube(axial);
    expect(cube.x + cube.y + cube.z).toBe(0);
    expect(cubeToAxial(cube)).toEqual(axial);
  });

  it('round-trips axial ↔ offset for odd and even parity', () => {
    const axial = createAxial(3, -2);
    for (const parity of ['odd', 'even'] as const) {
      const offset = axialToOffset(axial, parity);
      expect(offsetToAxial(offset, parity)).toEqual(axial);
    }
  });

  it('rejects invalid cube coordinates in createCube', () => {
    expect(() => createCube(1, 1, 1)).toThrow(/Invalid cube/);
  });
});

describe('pixel conversions', () => {
  const pointy = createLayout('pointy', 20, 100, 50);
  const flat = createLayout('flat', 20, 0, 0);

  it('round-trips pixel ↔ axial for pointy layout', () => {
    const axial = createAxial(1, -1);
    const pixel = axialToPixelPointy(axial, pointy);
    expect(pixelToAxialPointy(pixel, pointy)).toEqual(axial);
    expect(axialToPixel(axial, pointy)).toEqual(pixel);
    expect(pixelToAxial(pixel, pointy)).toEqual(axial);
  });

  it('round-trips pixel ↔ axial for flat layout', () => {
    const axial = createAxial(-2, 3);
    const pixel = axialToPixelFlat(axial, flat);
    expect(pixelToAxialFlat(pixel, flat)).toEqual(axial);
    expect(axialToPixel(axial, flat)).toEqual(pixel);
  });

  it('maps near-center pixels to the same hex (boundary rounding)', () => {
    const center = createAxial(0, 0);
    const originPixel = axialToPixel(center, pointy);
    // Nudge toward an edge but stay inside the hex
    const nudged = { x: originPixel.x + 3, y: originPixel.y + 2 };
    expect(pixelToAxial(nudged, pointy)).toEqual(center);
  });

  it('maps a far pixel to a different neighboring hex', () => {
    const originPixel = axialToPixel(createAxial(0, 0), pointy);
    const far = { x: originPixel.x + pointy.size * 2, y: originPixel.y };
    expect(hexEquals(pixelToAxial(far, pointy), createAxial(0, 0))).toBe(false);
  });
});

describe('rounding', () => {
  it('cubeRound restores cube constraint after fractional coords', () => {
    const rounded = cubeRound({ x: 0.6, y: -0.3, z: -0.3 });
    expect(rounded.x + rounded.y + rounded.z).toBe(0);
  });

  it('hexRound snaps fractional axial to nearest hex', () => {
    const nearOrigin = hexRound({ q: 0.1, r: -0.1 });
    // cubeRound can yield -0; treat +0/-0 as equal
    expect(nearOrigin.q === 0 && nearOrigin.r === 0).toBe(true);
    expect(hexRound({ q: 0.9, r: 0 })).toEqual(createAxial(1, 0));
  });
});

describe('neighbors', () => {
  const origin = createAxial(0, 0);

  it('returns six neighbors', () => {
    const neighbors = getNeighbors(origin);
    expect(neighbors).toHaveLength(6);
    expect(neighbors.every((n) => areNeighbors(origin, n))).toBe(true);
  });

  it('getNeighbor uses direction index mod 6', () => {
    expect(getNeighbor(origin, 0)).toEqual(createAxial(1, 0));
    expect(getNeighbor(origin, 6)).toEqual(getNeighbor(origin, 0));
  });

  it('returns six diagonal neighbors that are distance 2', () => {
    const diagonals = getDiagonalNeighbors(origin);
    expect(diagonals).toHaveLength(6);
    expect(diagonals.every((d) => hexDistance(origin, d) === 2)).toBe(true);
  });

  it('areNeighbors is false for non-adjacent cells', () => {
    expect(areNeighbors(origin, createAxial(2, 0))).toBe(false);
  });
});

describe('distance and ranges', () => {
  const center = createAxial(0, 0);

  it('computes cube distance', () => {
    expect(hexDistance(center, createAxial(3, -2))).toBe(3);
    expect(hexDistance(center, center)).toBe(0);
  });

  it('hexesInRange includes center and grows with radius', () => {
    expect(hexesInRange(center, 0)).toEqual([center]);
    expect(hexesInRange(center, 1)).toHaveLength(7); // 1 + 6
    expect(hexesInRange(center, 2)).toHaveLength(19); // 1 + 6 + 12
  });

  it('hexRing returns the ring at exact radius', () => {
    expect(hexRing(center, 0)).toEqual([center]);
    expect(hexRing(center, 2)).toHaveLength(12);
    expect(hexRing(center, 2).every((h) => hexDistance(center, h) === 2)).toBe(true);
  });

  it('hexSpiral is center plus successive rings', () => {
    const spiral = hexSpiral(center, 2);
    expect(spiral[0]).toEqual(center);
    expect(spiral).toHaveLength(19);
  });
});

describe('lines, rotation, reflection', () => {
  it('draws a line between two hexes including endpoints', () => {
    const a = createAxial(0, 0);
    const b = createAxial(3, 0);
    const line = hexLine(a, b);
    expect(line[0]).toEqual(a);
    expect(line.at(-1)).toEqual(b);
    expect(line).toHaveLength(4);
  });

  it('hexLine of a point to itself is a singleton', () => {
    const a = createAxial(1, 1);
    expect(hexLine(a, a)).toEqual([a]);
  });

  it('rotateRight/Left are inverses around the origin', () => {
    const coord = createAxial(2, -1);
    expect(rotateLeft(rotateRight(coord))).toEqual(coord);
    expect(rotateRight(rotateRight(rotateRight(rotateRight(rotateRight(rotateRight(coord))))))).toEqual(
      coord
    );
  });

  it('rotateAround preserves distance from center', () => {
    const center = createAxial(1, 1);
    const coord = createAxial(3, 1);
    const rotated = rotateAround(coord, center, 2);
    expect(hexDistance(center, rotated)).toBe(hexDistance(center, coord));
  });

  it('reflect swaps cube axes for q/r/s', () => {
    const coord = createAxial(2, -3);
    const cube = axialToCube(coord);
    expect(axialToCube(reflect(coord, 'q'))).toEqual({ x: cube.x, y: cube.z, z: cube.y });
    expect(axialToCube(reflect(coord, 'r'))).toEqual({ x: cube.z, y: cube.y, z: cube.x });
    expect(axialToCube(reflect(coord, 's'))).toEqual({ x: cube.y, y: cube.x, z: cube.z });
  });
});

describe('equality helpers', () => {
  it('compares and searches axial coords', () => {
    const a = createAxial(1, 2);
    const b = createAxial(1, 2);
    const c = createAxial(0, 0);
    expect(hexEquals(a, b)).toBe(true);
    expect(hexInArray(a, [c, b])).toBe(true);
    expect(hexInArray(a, [c])).toBe(false);
  });
});
