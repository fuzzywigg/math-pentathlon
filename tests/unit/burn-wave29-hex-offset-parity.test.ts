/**
 * Wave 29 — odd-q / even-q offset ↔ axial round-trip matrix.
 * Deepens existing hex-coordinates offset converters.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  axialToOffset,
  offsetToAxial,
  createAxial,
  createOffset,
  hexEquals,
  type OffsetParity,
} from '../../src/core/hex';

const PARITIES: OffsetParity[] = ['odd', 'even'];

describe('Wave 29 hex-offset — axial ↔ offset round-trips', () => {
  it('round-trips every axial in a 13×13 window for both parities', () => {
    for (const parity of PARITIES) {
      for (let q = -6; q <= 6; q++) {
        for (let r = -6; r <= 6; r++) {
          const a = createAxial(q, r);
          const off = axialToOffset(a, parity);
          const back = offsetToAxial(off, parity);
          expect(hexEquals(back, a)).toBe(true);
        }
      }
    }
  });

  it('round-trips every offset col/row in a window for both parities', () => {
    for (const parity of PARITIES) {
      for (let col = -5; col <= 5; col++) {
        for (let row = -5; row <= 5; row++) {
          const off = createOffset(col, row);
          const axial = offsetToAxial(off, parity);
          const back = axialToOffset(axial, parity);
          expect(back).toEqual(off);
        }
      }
    }
  });
});

describe('Wave 29 hex-offset — parity differences', () => {
  it('odd vs even can disagree on the same axial', () => {
    const a = createAxial(3, 2);
    const odd = axialToOffset(a, 'odd');
    const even = axialToOffset(a, 'even');
    // Same column; row offset formula differs by parity bit
    expect(odd.col).toBe(3);
    expect(even.col).toBe(3);
    expect(odd.row).not.toBe(even.row);
  });

  it('defaults to odd parity when omitted', () => {
    const a = createAxial(5, -1);
    expect(axialToOffset(a)).toEqual(axialToOffset(a, 'odd'));
    const off = createOffset(5, 4);
    expect(offsetToAxial(off)).toEqual(offsetToAxial(off, 'odd'));
  });

  it('origin stays at offset (0,0) for both parities', () => {
    const origin = createAxial(0, 0);
    expect(axialToOffset(origin, 'odd')).toEqual({ col: 0, row: 0 });
    expect(axialToOffset(origin, 'even')).toEqual({ col: 0, row: 0 });
  });
});

describe('Wave 29 hex-offset — formula spot checks', () => {
  it('odd-q: row = r + floor((q + (q&1))/2)', () => {
    const cases = [
      { q: 0, r: 0, col: 0, row: 0 },
      { q: 1, r: 0, col: 1, row: 1 },
      { q: 2, r: 0, col: 2, row: 1 },
      { q: -1, r: 1, col: -1, row: 1 },
      { q: 4, r: -2, col: 4, row: 0 },
    ];
    for (const c of cases) {
      expect(axialToOffset(createAxial(c.q, c.r), 'odd')).toEqual({
        col: c.col,
        row: c.row,
      });
      expect(offsetToAxial({ col: c.col, row: c.row }, 'odd')).toEqual({
        q: c.q,
        r: c.r,
      });
    }
  });

  it('even-q: row = r + floor((q + ((q+1)&1))/2)', () => {
    const cases = [
      { q: 0, r: 0, col: 0, row: 0 },
      { q: 1, r: 0, col: 1, row: 0 },
      { q: 2, r: 0, col: 2, row: 1 },
      // q=-1: parityOffset=((0)&1)=0 → row = 1 + floor(-1/2) = 0
      { q: -1, r: 1, col: -1, row: 0 },
      { q: 3, r: -1, col: 3, row: 0 },
    ];
    for (const c of cases) {
      expect(axialToOffset(createAxial(c.q, c.r), 'even')).toEqual({
        col: c.col,
        row: c.row,
      });
    }
  });
});

describe('Wave 29 hex-offset — createOffset factory', () => {
  it('returns independent plain objects', () => {
    const a = createOffset(2, 3);
    const b = createOffset(2, 3);
    expect(a).toEqual(b);
    expect(a).not.toBe(b);
  });
});
