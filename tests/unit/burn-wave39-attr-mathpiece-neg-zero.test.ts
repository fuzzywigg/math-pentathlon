/**
 * Wave 39 — createMathPiece / areCoprime / digitSum edge leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createMathPiece,
  areCoprime,
  getDigitSum,
  isPerfectSquare,
  sortByAttribute,
} from '../../src/core/attributes';

describe('Wave 39 attr — mathpiece neg/zero', () => {
  it('zero piece has even, non-prime, digitSum 0', () => {
    const p = createMathPiece(0);
    expect(p.id).toBe('num-0');
    expect(p.attributes.number).toBe(0);
    expect(p.attributes.isPrime).toBe(false);
    expect(p.attributes.isEven).toBe(true);
    expect(p.attributes.digitSum).toBe(0);
    expect(p.attributes.isSquare).toBe(true);
  });

  it('negative uses abs for digitSum and factors', () => {
    const p = createMathPiece(-12);
    expect(p.attributes.digitSum).toBe(getDigitSum(-12));
    expect(getDigitSum(-12)).toBe(3);
    expect(p.attributes.isEven).toBe(true);
    expect(p.attributes.divisibleBy3).toBe(true);
  });

  it('areCoprime with zeros and negatives', () => {
    expect(areCoprime(0, 1)).toBe(true);
    expect(areCoprime(0, 0)).toBe(false); // gcd(0,0)=0
    expect(areCoprime(-8, 15)).toBe(true);
    expect(areCoprime(14, 21)).toBe(false);
  });

  it('isPerfectSquare rejects negatives', () => {
    expect(isPerfectSquare(-4)).toBe(false);
    expect(isPerfectSquare(9)).toBe(true);
  });

  it('sortByAttribute mixed string localeCompare', () => {
    const pieces = [
      { id: '1', attributes: { label: 'b' } },
      { id: '2', attributes: { label: 'a' } },
      { id: '3', attributes: { label: 'c' } },
    ];
    const asc = sortByAttribute(pieces, 'label');
    expect(asc.map((p) => p.id)).toEqual(['2', '1', '3']);
    const desc = sortByAttribute(pieces, 'label', true);
    expect(desc.map((p) => p.id)).toEqual(['3', '1', '2']);
  });
});
