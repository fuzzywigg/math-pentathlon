/**
 * Wave 40 — hex flat/pointy axialToPixel dispatch leftovers after #176.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createAxial,
  createLayout,
  axialToPixel,
  axialToPixelFlat,
  axialToPixelPointy,
  pixelToAxial,
  hexEquals,
} from '../../src/core/hex';

describe('Wave 40 hex — flat/pointy pixel dispatch', () => {
  const a = createAxial(1, 1);

  it('pointy layout dispatches to axialToPixelPointy', () => {
    const layout = createLayout('pointy', 20);
    const via = axialToPixel(a, layout);
    const direct = axialToPixelPointy(a, layout);
    expect(via.x).toBeCloseTo(direct.x, 8);
    expect(via.y).toBeCloseTo(direct.y, 8);
    expect(hexEquals(pixelToAxial(via, layout), a)).toBe(true);
  });

  it('flat layout dispatches to axialToPixelFlat', () => {
    const layout = createLayout('flat', 20, 5, 5);
    const via = axialToPixel(a, layout);
    const direct = axialToPixelFlat(a, layout);
    expect(via.x).toBeCloseTo(direct.x, 8);
    expect(via.y).toBeCloseTo(direct.y, 8);
    expect(hexEquals(pixelToAxial(via, layout), a)).toBe(true);
  });
});
