/**
 * Wave 37 — parseFraction whitespace / reject leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  parseFraction,
  areEqual,
  createFraction,
  fromWhole,
  fromMixedNumber,
} from '../../src/core/fractions';

describe('Wave 37 frac-parse — trim and shapes', () => {
  it('trims surrounding whitespace for all shapes', () => {
    expect(areEqual(parseFraction('  3/4  ')!, createFraction(3, 4))).toBe(
      true
    );
    expect(areEqual(parseFraction('\t1 1/2\n')!, fromMixedNumber(1, 1, 2))).toBe(
      true
    );
    expect(areEqual(parseFraction('  -7  ')!, fromWhole(-7))).toBe(true);
  });

  it('rejects malformed strings', () => {
    const bad = [
      '',
      ' ',
      '3/',
      '/4',
      '1 1/',
      '1 /2',
      '1 1 /2',
      'a/b',
      '1.5',
      '½',
      '3/0',
      '1 1/0',
      '--1',
      '1  -1/2',
    ];
    for (const s of bad) {
      expect(parseFraction(s)).toBeNull();
    }
  });

  it('accepts large wholes and fractions', () => {
    expect(parseFraction('123/456')).toEqual({
      numerator: 123,
      denominator: 456,
    });
    expect(parseFraction('-99 9/10')).toEqual(
      fromMixedNumber(-99, 9, 10)
    );
  });
});
