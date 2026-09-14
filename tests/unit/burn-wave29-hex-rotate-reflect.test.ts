/**
 * Wave 29 — hex rotate / reflect dihedral group properties.
 * Distinct from polyomino orientations (#145) and game piece rotate helpers.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  rotateRight,
  rotateLeft,
  rotateAround,
  reflect,
  hexDistance,
  hexEquals,
  axialToCube,
  createAxial,
  type AxialCoord,
} from '../../src/core/hex';

/** Object.is treats +0 and -0 as distinct; hex math can produce -0. */
function expectSameHex(a: AxialCoord, b: AxialCoord): void {
  expect(hexEquals(a, b)).toBe(true);
}

function expectSameCube(
  a: { x: number; y: number; z: number },
  b: { x: number; y: number; z: number }
): void {
  expect(a.x === b.x && a.y === b.y && a.z === b.z).toBe(true);
}

const SAMPLE: AxialCoord[] = [];
for (let q = -3; q <= 3; q++) {
  for (let r = -3; r <= 3; r++) {
    SAMPLE.push(createAxial(q, r));
  }
}

const key = (c: AxialCoord) => `${c.q},${c.r}`;

describe('Wave 29 hex-rotate — clockwise / counter-clockwise group', () => {
  it('rotateRight and rotateLeft are inverses', () => {
    for (const c of SAMPLE) {
      expectSameHex(rotateLeft(rotateRight(c)), c);
      expectSameHex(rotateRight(rotateLeft(c)), c);
    }
  });

  it('six rotateRight steps is identity', () => {
    for (const c of SAMPLE) {
      let x = c;
      for (let i = 0; i < 6; i++) x = rotateRight(x);
      expectSameHex(x, c);
    }
  });

  it('six rotateLeft steps is identity', () => {
    for (const c of SAMPLE) {
      let x = c;
      for (let i = 0; i < 6; i++) x = rotateLeft(x);
      expectSameHex(x, c);
    }
  });

  it('three right = three left = 180° (negation of cube)', () => {
    for (const c of SAMPLE) {
      let right3 = c;
      let left3 = c;
      for (let i = 0; i < 3; i++) {
        right3 = rotateRight(right3);
        left3 = rotateLeft(left3);
      }
      expectSameHex(right3, left3);
      const cube = axialToCube(c);
      expectSameCube(axialToCube(right3), {
        x: -cube.x,
        y: -cube.y,
        z: -cube.z,
      });
    }
  });

  it('rotation preserves distance from origin', () => {
    const origin = createAxial(0, 0);
    for (const c of SAMPLE) {
      expect(hexDistance(origin, rotateRight(c))).toBe(hexDistance(origin, c));
      expect(hexDistance(origin, rotateLeft(c))).toBe(hexDistance(origin, c));
    }
  });

  it('origin is a fixed point', () => {
    const o = createAxial(0, 0);
    expectSameHex(rotateRight(o), o);
    expectSameHex(rotateLeft(o), o);
  });

  it('orbit of a non-origin hex under rotateRight has size 6 (or 1)', () => {
    for (const c of SAMPLE) {
      if (hexEquals(c, createAxial(0, 0))) {
        expect(new Set([key(c)]).size).toBe(1);
        continue;
      }
      const orbit = new Set<string>();
      let x = c;
      for (let i = 0; i < 6; i++) {
        orbit.add(key(x));
        x = rotateRight(x);
      }
      expect(orbit.size).toBe(6);
      expectSameHex(x, c);
    }
  });
});

describe('Wave 29 hex-rotate — rotateAround center', () => {
  const centers = [createAxial(0, 0), createAxial(2, -1), createAxial(-3, 2)];

  it('steps=0 leaves the point unchanged', () => {
    for (const center of centers) {
      for (const c of SAMPLE.slice(0, 20)) {
        expectSameHex(rotateAround(c, center, 0), c);
      }
    }
  });

  it('steps mod 6; negative steps normalize', () => {
    const center = createAxial(1, 1);
    const c = createAxial(4, 0);
    expectSameHex(rotateAround(c, center, 6), c);
    expectSameHex(rotateAround(c, center, 7), rotateAround(c, center, 1));
    expectSameHex(rotateAround(c, center, -1), rotateAround(c, center, 5));
    expectSameHex(rotateAround(c, center, -6), c);
  });

  it('preserves distance from the rotation center', () => {
    for (const center of centers) {
      for (const c of SAMPLE) {
        for (const steps of [1, 2, 3, 4, 5]) {
          const rotated = rotateAround(c, center, steps);
          expect(hexDistance(center, rotated)).toBe(hexDistance(center, c));
        }
      }
    }
  });

  it('center is a fixed point for any steps', () => {
    for (const center of centers) {
      for (const steps of [0, 1, 2, 3, 4, 5, 9, -2]) {
        expectSameHex(rotateAround(center, center, steps), center);
      }
    }
  });

  it('around origin matches repeated rotateRight', () => {
    const origin = createAxial(0, 0);
    for (const c of SAMPLE) {
      for (let steps = 0; steps < 6; steps++) {
        let expected = c;
        for (let i = 0; i < steps; i++) expected = rotateRight(expected);
        expectSameHex(rotateAround(c, origin, steps), expected);
      }
    }
  });

  it('six steps around any center is identity', () => {
    const center = createAxial(-2, 3);
    for (const c of SAMPLE) {
      expectSameHex(rotateAround(c, center, 6), c);
    }
  });
});

describe('Wave 29 hex-rotate — reflect involutions', () => {
  it('reflect twice is identity on every axis', () => {
    for (const axis of ['q', 'r', 's'] as const) {
      for (const c of SAMPLE) {
        expectSameHex(reflect(reflect(c, axis), axis), c);
      }
    }
  });

  it('reflect swaps the documented cube axes', () => {
    for (const c of SAMPLE) {
      const cube = axialToCube(c);
      expectSameCube(axialToCube(reflect(c, 'q')), {
        x: cube.x,
        y: cube.z,
        z: cube.y,
      });
      expectSameCube(axialToCube(reflect(c, 'r')), {
        x: cube.z,
        y: cube.y,
        z: cube.x,
      });
      expectSameCube(axialToCube(reflect(c, 's')), {
        x: cube.y,
        y: cube.x,
        z: cube.z,
      });
    }
  });

  it('reflect preserves distance from origin', () => {
    const origin = createAxial(0, 0);
    for (const axis of ['q', 'r', 's'] as const) {
      for (const c of SAMPLE) {
        expect(hexDistance(origin, reflect(c, axis))).toBe(
          hexDistance(origin, c)
        );
      }
    }
  });

  it('origin is fixed under every reflection', () => {
    const o = createAxial(0, 0);
    for (const axis of ['q', 'r', 's'] as const) {
      expectSameHex(reflect(o, axis), o);
    }
  });

  it('points with equal paired cube axes are fixed by the matching reflection', () => {
    // reflect q keeps x, swaps y/z — fixed when y === z
    expectSameHex(reflect(createAxial(2, -1), 'q'), createAxial(2, -1));
    // reflect r keeps y, swaps x/z — fixed when x === z → axial (a, a)
    expectSameHex(reflect(createAxial(2, 2), 'r'), createAxial(2, 2));
    // reflect s keeps z, swaps x/y — fixed when x === y → axial (a, -2a)
    expectSameHex(reflect(createAxial(1, -2), 's'), createAxial(1, -2));
  });
});
