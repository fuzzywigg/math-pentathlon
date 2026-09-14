/**
 * Overnight TOKENMAXX — hex pixel flat/pointy roundtrip leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  axialToPixelFlat,
  axialToPixelPointy,
  axialToPixel,
  pixelToAxialFlat,
  pixelToAxialPointy,
  pixelToAxial,
  hexEquals,
} from '../../src/core/hex/coordinates';
import { createAxial, HexLayout } from '../../src/core/hex/types';

const pointy: HexLayout = { orientation: 'pointy', size: 20, origin: { x: 100, y: 50 } };
const flat: HexLayout = { orientation: 'flat', size: 16, origin: { x: -10, y: 8 } };

describe('Overnight hex — pixel layout roundtrips', () => {
  it('pointy axial→pixel→axial recovers lattice cells', () => {
    for (let q = -3; q <= 3; q++) {
      for (let r = -3; r <= 3; r++) {
        const a = createAxial(q, r);
        const px = axialToPixelPointy(a, pointy);
        expect(hexEquals(pixelToAxialPointy(px, pointy), a)).toBe(true);
        expect(hexEquals(pixelToAxial(axialToPixel(a, pointy), pointy), a)).toBe(true);
      }
    }
  });

  it('flat axial→pixel→axial recovers lattice cells', () => {
    for (let q = -3; q <= 3; q++) {
      for (let r = -3; r <= 3; r++) {
        const a = createAxial(q, r);
        const px = axialToPixelFlat(a, flat);
        expect(hexEquals(pixelToAxialFlat(px, flat), a)).toBe(true);
        expect(hexEquals(pixelToAxial(axialToPixel(a, flat), flat), a)).toBe(true);
      }
    }
  });
});
