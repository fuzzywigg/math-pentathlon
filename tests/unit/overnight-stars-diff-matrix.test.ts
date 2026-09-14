/**
 * Overnight HEAVY after #214/#215 — Stars countDifferences leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  countDifferences,
  getDifferenceDescription,
  type AttributeCard,
} from '../../src/games/stars-bars/types';

function card(partial: Partial<AttributeCard> & Pick<AttributeCard, 'id'>): AttributeCard {
  return {
    shape: 'circle',
    color: 'red',
    size: 'small',
    thickness: 'thin',
    ...partial,
  };
}

describe('Overnight stars-bars — diff matrix', () => {
  it('0..4 differences with descriptions', () => {
    const a = card({ id: 'a' });
    expect(countDifferences(a, card({ id: 'b' }))).toBe(0);
    expect(countDifferences(a, card({ id: 'c', color: 'blue' }))).toBe(1);
    expect(
      countDifferences(
        a,
        card({ id: 'd', shape: 'square', color: 'blue', size: 'large', thickness: 'thick' })
      )
    ).toBe(4);
    const desc = getDifferenceDescription(
      a,
      card({ id: 'e', color: 'yellow', size: 'large' })
    );
    expect(desc.length).toBeGreaterThan(0);
  });
});
