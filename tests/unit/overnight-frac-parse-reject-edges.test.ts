/**
 * Overnight TOKENMAXX HEAVY — parseFraction reject edges leftover.
 * After #214/#215. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { parseFraction } from '../../src/core/fractions/arithmetic';

describe('Overnight frac — parse reject edges', () => {
  it.each(['+3/4', '3 / 4', '1/-2', '1.5/2', '½', '3/', '/4', '1 1/-2'])(
    'rejects %s',
    (s) => {
      expect(parseFraction(s)).toBeNull();
    }
  );

  it('accepts trimmed simple + mixed negatives already covered nearby', () => {
    expect(parseFraction('  -3/4  ')).toEqual({
      numerator: -3,
      denominator: 4,
    });
    expect(parseFraction('-1 1/2')).toEqual({
      numerator: -3,
      denominator: 2,
    });
  });
});
