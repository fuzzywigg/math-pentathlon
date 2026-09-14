/**
 * Wave 42 — handshake: stars countDifferences × fab areEquivalent.
 * Pure engine agreement on identity vs value. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  countDifferences,
  type AttributeCard,
} from '../../src/games/stars-bars/types';
import { areEquivalent } from '../../src/core/fractions/arithmetic';
import { calculateResult } from '../../src/games/fab-a-diffy/rules';

const card = (
  overrides: Partial<AttributeCard> & Pick<AttributeCard, 'id'>
): AttributeCard => ({
  shape: 'circle',
  color: 'red',
  size: 'small',
  thickness: 'thin',
  ...overrides,
});

describe('Wave 42 handshake — stars × fab identity', () => {
  it('identical cards → 0 diffs; equivalent fractions → true', () => {
    const a = card({ id: 'a' });
    const b = card({ id: 'b' });
    expect(countDifferences(a, b)).toBe(0);
    expect(
      areEquivalent(
        { numerator: 1, denominator: 2 },
        { numerator: 2, denominator: 4 }
      )
    ).toBe(true);
  });

  it('one attr differ → 1; fab multiply preserves equivalence class', () => {
    const a = card({ id: 'a' });
    const b = card({ id: 'b', color: 'blue' });
    expect(countDifferences(a, b)).toBe(1);
    const half = { numerator: 1, denominator: 2 };
    const result = calculateResult(half, half, 'multiply');
    expect(result).not.toBeNull();
    expect(areEquivalent(result!, { numerator: 1, denominator: 4 })).toBe(true);
  });

  it('four attrs differ → 4; unequal fractions not equivalent', () => {
    const a = card({ id: 'a' });
    const b = card({
      id: 'b',
      shape: 'square',
      color: 'yellow',
      size: 'large',
      thickness: 'thick',
    });
    expect(countDifferences(a, b)).toBe(4);
    expect(
      areEquivalent(
        { numerator: 1, denominator: 3 },
        { numerator: 1, denominator: 2 }
      )
    ).toBe(false);
  });
});
