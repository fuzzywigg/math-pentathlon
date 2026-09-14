/**
 * Wave 29 — offset parity separation + col/row span tables.
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
  hexDistance,
  type OffsetParity,
} from '../../src/core/hex';

describe('Wave 29 hex-offset-span — column equals axial q', () => {
  it('col is always axial.q for both parities', () => {
    for (const parity of ['odd', 'even'] as OffsetParity[]) {
      for (let q = -8; q <= 8; q++) {
        for (let r = -4; r <= 4; r++) {
          expect(axialToOffset(createAxial(q, r), parity).col).toBe(q);
        }
      }
    }
  });
});

describe('Wave 29 hex-offset-span — inverse preserves neighbors distances', () => {
  it('offset-adjacent cells (same col, row±1) are hex-distance 1 or 2', () => {
    for (const parity of ['odd', 'even'] as OffsetParity[]) {
      for (let col = -3; col <= 3; col++) {
        for (let row = -3; row <= 3; row++) {
          const a = offsetToAxial(createOffset(col, row), parity);
          const b = offsetToAxial(createOffset(col, row + 1), parity);
          const d = hexDistance(a, b);
          expect(d === 1 || d === 2).toBe(true);
        }
      }
    }
  });

  it('same-row offset neighbors (col±1) stay within distance 2', () => {
    for (const parity of ['odd', 'even'] as OffsetParity[]) {
      for (let col = -3; col <= 3; col++) {
        for (let row = -3; row <= 3; row++) {
          const a = offsetToAxial(createOffset(col, row), parity);
          const b = offsetToAxial(createOffset(col + 1, row), parity);
          expect(hexDistance(a, b)).toBeLessThanOrEqual(2);
          expect(hexDistance(a, b)).toBeGreaterThanOrEqual(1);
        }
      }
    }
  });
});

describe('Wave 29 hex-offset-span — mismatched parity breaks round-trip', () => {
  it('encoding with odd and decoding with even is not identity in general', () => {
    const a = createAxial(3, 2);
    const encodedOdd = axialToOffset(a, 'odd');
    const decodedEven = offsetToAxial(encodedOdd, 'even');
    // Not always different, but for this sample it diverges
    expect(hexEquals(decodedEven, a)).toBe(false);
  });

  it('double conversion with matching parity restores axial', () => {
    for (const parity of ['odd', 'even'] as OffsetParity[]) {
      const samples = [
        createAxial(0, 0),
        createAxial(6, -3),
        createAxial(-5, 2),
        createAxial(1, 7),
      ];
      for (const a of samples) {
        expect(
          hexEquals(offsetToAxial(axialToOffset(a, parity), parity), a)
        ).toBe(true);
      }
    }
  });
});

describe('Wave 29 hex-offset-span — row monotonicity in r for fixed q', () => {
  it('increasing r increases offset.row by 1', () => {
    for (const parity of ['odd', 'even'] as OffsetParity[]) {
      for (let q = -5; q <= 5; q++) {
        let prev = axialToOffset(createAxial(q, -5), parity).row;
        for (let r = -4; r <= 5; r++) {
          const row = axialToOffset(createAxial(q, r), parity).row;
          expect(row - prev).toBe(1);
          prev = row;
        }
      }
    }
  });
});
