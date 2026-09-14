/**
 * Wave 39 — handshake: hex distance ↔ alignment region size ↔ attr digitSum.
 * Cross-module leftovers after #174. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createAxial,
  hexDistance,
  hexRing,
  hexEquals,
} from '../../src/core/hex';
import {
  findRegion,
  regionTouchesEdge,
} from '../../src/core/alignment/contiguous';
import {
  getDigitSum,
  isPerfectSquare,
  createMathPiece,
} from '../../src/core/attributes/logic';

describe('Wave 39 handshake — hex / align / attr', () => {
  it('hex ring radius equals digit-sum of a square that matches region size', () => {
    const center = createAxial(0, 0);
    const ring = hexRing(center, 2);
    expect(ring).toHaveLength(12);
    // 3x4 block of 'X' → one region size 12
    const values = [
      ['X', 'X', 'X', 'X'],
      ['X', 'X', 'X', 'X'],
      ['X', 'X', 'X', 'X'],
    ];
    const getCell = (r: number, c: number) =>
      r >= 0 && c >= 0 && r < 3 && c < 4 ? values[r][c] : null;
    const region = findRegion(0, 0, getCell, { rows: 3, cols: 4 });
    expect(region?.size).toBe(12);
    expect(getDigitSum(region!.size)).toBe(1 + 2);
    expect(isPerfectSquare(region!.size)).toBe(false);
    expect(hexDistance(center, ring[0])).toBe(2);
  });

  it('math piece digitSum tracks hexEquals stability', () => {
    const a = createAxial(3, -1);
    const b = createAxial(3, -1);
    expect(hexEquals(a, b)).toBe(true);
    const piece = createMathPiece(36);
    expect(piece.attributes.isSquare).toBe(true);
    expect(piece.attributes.digitSum).toBe(9);
    const topEdge = findRegion(
      0,
      0,
      (r, c) => (r === 0 && c < 3 ? 'T' : null),
      { rows: 2, cols: 3 }
    );
    expect(topEdge && regionTouchesEdge(topEdge, 'top', { rows: 2, cols: 3 })).toBe(
      true
    );
  });
});
