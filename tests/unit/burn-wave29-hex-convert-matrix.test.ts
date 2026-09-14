/**
 * Wave 29 — hex axial/cube/offset conversion matrices.
 * Distinct from #143 graph topology, #144 frac arithmetic, #145 polyomino transform,
 * wave 23 hex-ui, wave 21/25 hex-region contiguous, and thin hex-coordinates smoke.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  axialToCube,
  cubeToAxial,
  axialToOffset,
  offsetToAxial,
  createAxial,
  createCube,
  createOffset,
  type OffsetParity,
} from '../../src/core/hex';

const SAMPLE: Array<[number, number]> = [];
for (let q = -4; q <= 4; q++) {
  for (let r = -4; r <= 4; r++) {
    SAMPLE.push([q, r]);
  }
}

describe('Wave 29 hex-convert — axial ↔ cube constraint grid', () => {
  it('every sample axial maps to a cube with x+y+z=0', () => {
    for (const [q, r] of SAMPLE) {
      const cube = axialToCube(createAxial(q, r));
      expect(cube.x + cube.y + cube.z).toBe(0);
      expect(cube.x).toBe(q);
      expect(cube.z).toBe(r);
      expect(cube.y).toBe(-q - r);
    }
  });

  it('cubeToAxial is left-inverse of axialToCube on the sample', () => {
    for (const [q, r] of SAMPLE) {
      const axial = createAxial(q, r);
      expect(cubeToAxial(axialToCube(axial))).toEqual(axial);
    }
  });

  it('axialToCube is left-inverse of cubeToAxial for valid cubes', () => {
    for (const [q, r] of SAMPLE) {
      const cube = createCube(q, -q - r, r);
      expect(axialToCube(cubeToAxial(cube))).toEqual(cube);
    }
  });

  it('createCube rejects triples that violate the constraint', () => {
    expect(() => createCube(1, 0, 0)).toThrow(/Invalid cube/);
    expect(() => createCube(2, 2, -3)).toThrow(/Invalid cube/);
    expect(() => createCube(0, 0, 1)).toThrow(/Invalid cube/);
  });

  it('createCube accepts zeros and complementary triples', () => {
    expect(createCube(0, 0, 0)).toEqual({ x: 0, y: 0, z: 0 });
    expect(createCube(3, -1, -2)).toEqual({ x: 3, y: -1, z: -2 });
  });
});

describe('Wave 29 hex-convert — offset parity round-trip matrix', () => {
  const parities: OffsetParity[] = ['odd', 'even'];

  it('axial → offset → axial restores every sample for both parities', () => {
    for (const parity of parities) {
      for (const [q, r] of SAMPLE) {
        const axial = createAxial(q, r);
        const offset = axialToOffset(axial, parity);
        expect(offsetToAxial(offset, parity)).toEqual(axial);
      }
    }
  });

  it('offset → axial → offset restores a rectangular offset grid', () => {
    for (const parity of parities) {
      for (let col = -5; col <= 5; col++) {
        for (let row = -5; row <= 5; row++) {
          const offset = createOffset(col, row);
          const axial = offsetToAxial(offset, parity);
          expect(axialToOffset(axial, parity)).toEqual(offset);
        }
      }
    }
  });

  it('odd and even parity can disagree on the same axial', () => {
    const axial = createAxial(3, -2);
    const odd = axialToOffset(axial, 'odd');
    const even = axialToOffset(axial, 'even');
    // Same column; row shift differs by parity formula
    expect(odd.col).toBe(even.col);
    expect(odd.col).toBe(3);
    expect(odd.row).not.toBe(even.row);
  });

  it('default parity is odd-q', () => {
    const axial = createAxial(2, 1);
    expect(axialToOffset(axial)).toEqual(axialToOffset(axial, 'odd'));
  });

  it('origin stays at offset (0,0) for both parities', () => {
    const origin = createAxial(0, 0);
    expect(axialToOffset(origin, 'odd')).toEqual({ col: 0, row: 0 });
    expect(axialToOffset(origin, 'even')).toEqual({ col: 0, row: 0 });
  });

  it('parity mismatch breaks round-trip (documented hazard)', () => {
    const axial = createAxial(1, 0);
    const asOdd = axialToOffset(axial, 'odd');
    const backAsEven = offsetToAxial(asOdd, 'even');
    expect(backAsEven).not.toEqual(axial);
  });
});

describe('Wave 29 hex-convert — offset formula spot checks', () => {
  it('odd-q: positive q shifts row by floor((q+1)/2) when q odd', () => {
    // axial (1,0) → col=1, offset=1&1=1 → row = 0 + floor((1+1)/2) = 1
    expect(axialToOffset(createAxial(1, 0), 'odd')).toEqual({ col: 1, row: 1 });
    // axial (2,0) → col=2, offset=0 → row = 0 + floor(2/2) = 1
    expect(axialToOffset(createAxial(2, 0), 'odd')).toEqual({ col: 2, row: 1 });
  });

  it('even-q: q=1 uses (q+1)&1 = 0 offset', () => {
    expect(axialToOffset(createAxial(1, 0), 'even')).toEqual({
      col: 1,
      row: 0,
    });
    expect(axialToOffset(createAxial(2, 0), 'even')).toEqual({
      col: 2,
      row: 1,
    });
  });
});
