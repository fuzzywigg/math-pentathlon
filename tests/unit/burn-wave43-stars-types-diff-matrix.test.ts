/**
 * Wave 43 — Stars & Bars attribute diff matrix leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  CONFIG,
  SHAPES,
  COLORS,
  SIZES,
  THICKNESSES,
  countDifferences,
  getDifferenceDescription,
  type AttributeCard,
} from '../../src/games/stars-bars/types';

describe('Wave 43 stars-bars — types diff matrix', () => {
  it('CONFIG and attribute catalogs', () => {
    expect(CONFIG.BOARD_SIZE).toBe(5);
    expect(CONFIG.HAND_SIZE).toBe(5);
    expect(CONFIG.TARGET_SCORE).toBe(30);
    expect(SHAPES).toHaveLength(5);
    expect(COLORS).toHaveLength(3);
    expect(SIZES).toHaveLength(2);
    expect(THICKNESSES).toHaveLength(2);
  });

  it('countDifferences 0..4 ladder', () => {
    const a: AttributeCard = {
      id: 'a',
      shape: 'circle',
      color: 'red',
      size: 'small',
      thickness: 'thin',
    };
    expect(countDifferences(a, a)).toBe(0);
    expect(countDifferences(a, { ...a, shape: 'square' })).toBe(1);
    expect(countDifferences(a, { ...a, shape: 'square', color: 'blue' })).toBe(2);
    expect(
      countDifferences(a, {
        ...a,
        shape: 'square',
        color: 'blue',
        size: 'large',
      })
    ).toBe(3);
    expect(
      countDifferences(a, {
        id: 'b',
        shape: 'square',
        color: 'blue',
        size: 'large',
        thickness: 'thick',
      })
    ).toBe(4);
  });

  it('getDifferenceDescription lists changed attrs', () => {
    const a: AttributeCard = {
      id: 'a',
      shape: 'circle',
      color: 'red',
      size: 'small',
      thickness: 'thin',
    };
    const b = { ...a, shape: 'hexagon' as const, color: 'yellow' as const };
    const desc = getDifferenceDescription(a, b);
    expect(desc).toMatch(/shape/);
    expect(desc).toMatch(/color/);
    expect(desc).not.toMatch(/size/);
  });
});
