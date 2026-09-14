/**
 * Wave 45 — Par 55 createBlockSet catalog size leftovers after #208. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createBlockSet, SHAPES, COLORS, SIZES, THICKNESSES } from '../../src/games/par-55/types';

describe('Wave 45 par — block set catalog', () => {
  it('createBlockSet yields 60 unique ids (5×3×2×2)', () => {
    const blocks = createBlockSet();
    expect(blocks).toHaveLength(SHAPES.length * COLORS.length * SIZES.length * THICKNESSES.length);
    expect(blocks).toHaveLength(60);
    expect(new Set(blocks.map((b) => b.id)).size).toBe(60);
  });
});
