/**
 * Overnight TOKENMAXX — Stars getDifferenceDescription leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  getDifferenceDescription,
  countDifferences,
  type AttributeCard,
} from '../../src/games/stars-bars/types';

const base: AttributeCard = {
  id: 'a',
  shape: 'circle',
  color: 'red',
  size: 'small',
  thickness: 'thin',
};

describe('Overnight stars — diff description', () => {
  it('single-attr descriptions and ladder', () => {
    expect(
      getDifferenceDescription(base, { ...base, color: 'blue', id: 'b' })
    ).toBe('color');
    expect(
      getDifferenceDescription(base, { ...base, size: 'large', id: 'c' })
    ).toBe('size');
    expect(
      getDifferenceDescription(base, { ...base, thickness: 'thick', id: 'd' })
    ).toBe('thickness');
    expect(countDifferences(base, base)).toBe(0);
    expect(
      countDifferences(base, {
        id: 'e',
        shape: 'square',
        color: 'blue',
        size: 'large',
        thickness: 'thick',
      })
    ).toBe(4);
  });
});
