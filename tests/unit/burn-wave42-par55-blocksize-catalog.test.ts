/** Wave 42 — Par 55 createBlockSet length 60 unique. Tests-only. */
import { describe, it, expect } from 'vitest';

import {
  createBlockSet,
  SHAPES,
  COLORS,
  SIZES,
  THICKNESSES,
} from '../../src/games/par-55/types';

describe('Wave 42 par55 — blockset catalog', () => {
  it('createBlockSet length is 5×3×2×2 = 60', () => {
    const blocks = createBlockSet();
    expect(blocks).toHaveLength(
      SHAPES.length * COLORS.length * SIZES.length * THICKNESSES.length
    );
    expect(blocks).toHaveLength(60);
  });

  it('all block ids are unique', () => {
    const blocks = createBlockSet();
    const ids = blocks.map((b) => b.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('all attribute tuples are unique', () => {
    const blocks = createBlockSet();
    const keys = blocks.map(
      (b) => `${b.shape}|${b.color}|${b.size}|${b.thickness}`
    );
    expect(new Set(keys).size).toBe(60);
  });

  it('every shape/color/size/thickness appears at least once', () => {
    const blocks = createBlockSet();
    for (const shape of SHAPES) {
      expect(blocks.some((b) => b.shape === shape)).toBe(true);
    }
    for (const color of COLORS) {
      expect(blocks.some((b) => b.color === color)).toBe(true);
    }
    for (const size of SIZES) {
      expect(blocks.some((b) => b.size === size)).toBe(true);
    }
    for (const thickness of THICKNESSES) {
      expect(blocks.some((b) => b.thickness === thickness)).toBe(true);
    }
  });

  it('fresh createBlockSet returns a new array instance', () => {
    const a = createBlockSet();
    const b = createBlockSet();
    expect(a).not.toBe(b);
    expect(a).toEqual(b);
  });
});
