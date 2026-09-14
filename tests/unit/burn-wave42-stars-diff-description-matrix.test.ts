/**
 * Wave 42 — Stars & Bars countDifferences / getDifferenceDescription matrix. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  countDifferences,
  getDifferenceDescription,
  type AttributeCard,
} from '../../src/games/stars-bars/types';

const base: AttributeCard = {
  id: 'a',
  shape: 'circle',
  color: 'red',
  size: 'small',
  thickness: 'thin',
};

describe('Wave 42 stars — diff description matrix', () => {
  it('identical cards yield 0 and empty description', () => {
    const twin = { ...base, id: 'b' };
    expect(countDifferences(base, twin)).toBe(0);
    expect(getDifferenceDescription(base, twin)).toBe('');
  });

  it('single-attr diffs name the attribute', () => {
    expect(
      countDifferences(base, { ...base, id: 'c', shape: 'square' })
    ).toBe(1);
    expect(
      getDifferenceDescription(base, { ...base, id: 'c', shape: 'square' })
    ).toBe('shape');
    expect(
      getDifferenceDescription(base, { ...base, id: 'd', color: 'blue' })
    ).toBe('color');
    expect(
      getDifferenceDescription(base, { ...base, id: 'e', size: 'large' })
    ).toBe('size');
    expect(
      getDifferenceDescription(base, {
        ...base,
        id: 'f',
        thickness: 'thick',
      })
    ).toBe('thickness');
  });

  it('all four attrs differ and description lists all', () => {
    const opp: AttributeCard = {
      id: 'z',
      shape: 'hexagon',
      color: 'yellow',
      size: 'large',
      thickness: 'thick',
    };
    expect(countDifferences(base, opp)).toBe(4);
    expect(getDifferenceDescription(base, opp)).toBe(
      'shape, color, size, thickness'
    );
  });
});
