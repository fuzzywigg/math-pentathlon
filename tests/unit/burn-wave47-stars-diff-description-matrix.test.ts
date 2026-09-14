/**
 * Wave 47 leftover after #214/#215 leftovers D — stars diff description matrix. Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import {
  getDifferenceDescription,
  type AttributeCard,
} from '../../src/games/stars-bars/types';

function card(partial: Partial<AttributeCard> & { id: string }): AttributeCard {
  return {
    shape: 'circle',
    color: 'red',
    size: 'small',
    thickness: 'thin',
    ...partial,
  };
}

describe('Wave 47 stars deepen 15 — stars — getDifferenceDescription matrix', () => {
  it('describes 0 / 1 / 2 / 4 attribute diffs', () => {
    const base = card({ id: 'base' });

    expect(getDifferenceDescription(base, card({ id: 'same' }))).toBe('');

    expect(
      getDifferenceDescription(base, card({ id: 's', shape: 'square' }))
    ).toBe('shape');

    expect(
      getDifferenceDescription(
        base,
        card({ id: 'sc', shape: 'triangle', color: 'blue' })
      )
    ).toBe('shape, color');

    expect(
      getDifferenceDescription(
        base,
        card({
          id: 'all',
          shape: 'hexagon',
          color: 'yellow',
          size: 'large',
          thickness: 'thick',
        })
      )
    ).toBe('shape, color, size, thickness');
  });
});
