/**
 * Overnight TOKENMAXX — axialToPixel/pixelToAxial dispatch matches direct helpers.
 * Tests-only. After #214/#215.
 */
import { describe, it, expect } from 'vitest';
import {
  axialToPixel,
  axialToPixelPointy,
  axialToPixelFlat,
  pixelToAxial,
  pixelToAxialPointy,
  pixelToAxialFlat,
  hexEquals,
} from '../../src/core/hex/coordinates';
import { createAxial, createLayout } from '../../src/core/hex/types';

describe('Overnight core hex — pixel direct vs dispatch', () => {
  it('pointy dispatch ≡ axialToPixelPointy / pixelToAxialPointy', () => {
    const layout = createLayout('pointy', 22, 15, -8);
    const a = createAxial(-1, 3);
    const px = axialToPixel(a, layout);
    expect(px).toEqual(axialToPixelPointy(a, layout));
    expect(hexEquals(pixelToAxial(px, layout), a)).toBe(true);
    expect(hexEquals(pixelToAxialPointy(px, layout), a)).toBe(true);
  });

  it('flat dispatch ≡ axialToPixelFlat / pixelToAxialFlat', () => {
    const layout = createLayout('flat', 18, -20, 40);
    const a = createAxial(4, -2);
    const px = axialToPixel(a, layout);
    expect(px).toEqual(axialToPixelFlat(a, layout));
    expect(hexEquals(pixelToAxial(px, layout), a)).toBe(true);
    expect(hexEquals(pixelToAxialFlat(px, layout), a)).toBe(true);
  });
});
