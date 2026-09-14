/**
 * Wave 47 leftover after #214/#215 — Stars & Bars types / attribute-diff leftovers.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import {
  countDifferences,
  getDifferenceDescription,
  CONFIG,
  SHAPES,
  COLORS,
  SIZES,
  THICKNESSES,
  COLOR_VALUES,
} from '../../src/games/stars-bars/types';
import type { AttributeCard } from '../../src/games/stars-bars/types';

function card(partial: Partial<AttributeCard> & { id: string }): AttributeCard {
  return {
    shape: 'circle',
    color: 'red',
    size: 'small',
    thickness: 'thin',
    ...partial,
  };
}

describe('Wave 47 stars deepen 8 — Stars — catalog constants', () => {
  it('deck attribute cartesian product is 60 unique combos', () => {
    expect(SHAPES).toHaveLength(5);
    expect(COLORS).toHaveLength(3);
    expect(SIZES).toHaveLength(2);
    expect(THICKNESSES).toHaveLength(2);
    expect(SHAPES.length * COLORS.length * SIZES.length * THICKNESSES.length).toBe(
      60
    );
    expect(CONFIG.BOARD_SIZE).toBe(5);
    expect(CONFIG.HAND_SIZE).toBe(5);
    expect(CONFIG.TARGET_SCORE).toBe(30);
    expect(COLOR_VALUES.red).toMatch(/^#/);
    expect(COLOR_VALUES.blue).toMatch(/^#/);
    expect(COLOR_VALUES.yellow).toMatch(/^#/);
  });
});

describe('Wave 47 Stars — countDifferences matrix', () => {
  it.each([
    [0, card({ id: 'a' }), card({ id: 'b' })],
    [
      1,
      card({ id: 'a' }),
      card({ id: 'b', shape: 'square' }),
    ],
    [
      2,
      card({ id: 'a' }),
      card({ id: 'b', color: 'blue', size: 'large' }),
    ],
    [
      3,
      card({ id: 'a' }),
      card({ id: 'b', shape: 'hexagon', color: 'yellow', thickness: 'thick' }),
    ],
    [
      4,
      card({ id: 'a' }),
      card({
        id: 'b',
        shape: 'rectangle',
        color: 'blue',
        size: 'large',
        thickness: 'thick',
      }),
    ],
  ] as const)('diff=%i for attribute pair', (expected, a, b) => {
    expect(countDifferences(a, b)).toBe(expected);
    expect(countDifferences(b, a)).toBe(expected);
  });

  it('getDifferenceDescription lists changed attributes only', () => {
    const a = card({ id: 'a' });
    const same = getDifferenceDescription(a, card({ id: 'x' }));
    expect(same).toBe('');
    const one = getDifferenceDescription(
      a,
      card({ id: 'y', shape: 'triangle' })
    );
    expect(one).toContain('shape');
    expect(one.split(',').length).toBe(1);
    const multi = getDifferenceDescription(
      a,
      card({ id: 'z', color: 'blue', size: 'large', thickness: 'thick' })
    );
    expect(multi).toContain('color');
    expect(multi).toContain('size');
    expect(multi).toContain('thickness');
    expect(multi).not.toContain('shape');
  });
});
