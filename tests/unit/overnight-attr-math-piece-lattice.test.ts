/**
 * Overnight TOKENMAXX — math piece lattice / factors / coprime leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  isPrime,
  isPerfectSquare,
  getDigitSum,
  getFactors,
  areCoprime,
  createMathPiece,
} from '../../src/core/attributes/logic';

describe('Overnight attr — math lattice', () => {
  it('prime / square / digitSum / factors edges', () => {
    expect(isPrime(1)).toBe(false);
    expect(isPrime(2)).toBe(true);
    expect(isPrime(9)).toBe(false);
    expect(isPrime(17)).toBe(true);
    expect(isPerfectSquare(-1)).toBe(false);
    expect(isPerfectSquare(0)).toBe(true);
    expect(isPerfectSquare(16)).toBe(true);
    expect(getDigitSum(-99)).toBe(18);
    expect(getFactors(12)).toEqual([1, 2, 3, 4, 6, 12]);
    expect(getFactors(0)).toEqual([]);
    expect(areCoprime(8, 15)).toBe(true);
    expect(areCoprime(12, 18)).toBe(false);
  });

  it('createMathPiece catalogs properties for 0..20', () => {
    for (let n = 0; n <= 20; n++) {
      const piece = createMathPiece(n);
      expect(piece.id).toBe(`num-${n}`);
      expect(piece.attributes.number).toBe(n);
      expect(piece.attributes.isPrime).toBe(isPrime(n));
      expect(piece.attributes.isSquare).toBe(isPerfectSquare(n));
      expect(piece.attributes.digitSum).toBe(getDigitSum(n));
      expect(piece.attributes.isEven).toBe(n % 2 === 0);
      expect(piece.attributes.factorCount).toBe(getFactors(n).length);
    }
  });
});
