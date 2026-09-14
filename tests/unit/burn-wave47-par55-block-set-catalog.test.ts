/**
 * Wave 47 leftover after #214/#215 — Par 55 createBlockSet / catalog completeness leftovers after #186. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createBlockSet,
  SHAPES,
  COLORS,
  SIZES,
  THICKNESSES,
} from '../../src/games/par-55/types';

describe('Wave 47 par deepen 8 — Wave 47 par55 — block set catalog', () => {
  it('SHAPES/COLORS/SIZES/THICKNESSES lengths match product 60', () => {
    expect(SHAPES).toHaveLength(5);
    expect(COLORS).toHaveLength(3);
    expect(SIZES).toHaveLength(2);
    expect(THICKNESSES).toHaveLength(2);
    expect(
      SHAPES.length * COLORS.length * SIZES.length * THICKNESSES.length
    ).toBe(60);
  });

  it('createBlockSet returns 60 unique blocks covering every combo', () => {
    const blocks = createBlockSet();
    expect(blocks).toHaveLength(60);

    const ids = new Set(blocks.map((b) => b.id));
    expect(ids.size).toBe(60);

    for (const shape of SHAPES) {
      for (const color of COLORS) {
        for (const size of SIZES) {
          for (const thickness of THICKNESSES) {
            const found = blocks.filter(
              (b) =>
                b.shape === shape &&
                b.color === color &&
                b.size === size &&
                b.thickness === thickness
            );
            expect(found).toHaveLength(1);
          }
        }
      }
    }
  });

  it('block ids are sequential b0..b59', () => {
    const blocks = createBlockSet();
    expect(blocks[0].id).toBe('b0');
    expect(blocks[59].id).toBe('b59');
  });

  it('catalog constants contain only declared union members', () => {
    expect(SHAPES).toEqual([
      'circle',
      'square',
      'triangle',
      'rectangle',
      'hexagon',
    ]);
    expect(COLORS).toEqual(['red', 'blue', 'yellow']);
    expect(SIZES).toEqual(['small', 'large']);
    expect(THICKNESSES).toEqual(['thin', 'thick']);
  });
});
