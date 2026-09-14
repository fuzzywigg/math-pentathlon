/**
 * Wave 40 — hex pointy pixel roundtrip leftovers after #176.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createAxial,
  createLayout,
  axialToPixelPointy,
  pixelToAxialPointy,
  hexEquals,
} from '../../src/core/hex';

describe('Wave 40 hex — pointy pixel roundtrip', () => {
  const layout = createLayout('pointy', 30, 100, 80);

  it('origin axial maps near layout origin then back', () => {
    const a = createAxial(0, 0);
    const px = axialToPixelPointy(a, layout);
    expect(px.x).toBeCloseTo(100, 5);
    expect(px.y).toBeCloseTo(80, 5);
    expect(hexEquals(pixelToAxialPointy(px, layout), a)).toBe(true);
  });

  it('offset axial survives pixel roundtrip', () => {
    const a = createAxial(2, -1);
    const px = axialToPixelPointy(a, layout);
    expect(hexEquals(pixelToAxialPointy(px, layout), a)).toBe(true);
  });
});
