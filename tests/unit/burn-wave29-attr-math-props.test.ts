/**
 * Wave 29 — math property helpers / createMathPiece contracts.
 * Distinct from wave 21 (handful of prime/square samples) and #144 fraction arithmetic.
 * Tests-only. No product inventing.
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

describe('Wave 29 attr-math — isPrime boundary matrix', () => {
  it('rejects n < 2 including negatives and non-integers that fail trial', () => {
    for (const n of [-10, -1, 0, 1]) {
      expect(isPrime(n)).toBe(false);
    }
  });

  it('classifies small primes and composites', () => {
    const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
    const composites = [
      4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 21, 25, 27, 33, 35, 49,
    ];
    for (const p of primes) expect(isPrime(p)).toBe(true);
    for (const c of composites) expect(isPrime(c)).toBe(false);
  });

  it('handles larger known primes / products', () => {
    expect(isPrime(97)).toBe(true);
    expect(isPrime(100)).toBe(false);
    expect(isPrime(121)).toBe(false); // 11*11
    expect(isPrime(127)).toBe(true);
  });
});

describe('Wave 29 attr-math — isPerfectSquare / getDigitSum', () => {
  it('perfect squares include 0; reject negatives and near-misses', () => {
    expect(isPerfectSquare(0)).toBe(true);
    expect(isPerfectSquare(1)).toBe(true);
    expect(isPerfectSquare(144)).toBe(true);
    expect(isPerfectSquare(2)).toBe(false);
    expect(isPerfectSquare(15)).toBe(false);
    expect(isPerfectSquare(-4)).toBe(false);
    expect(isPerfectSquare(-1)).toBe(false);
  });

  it('digit sum uses absolute value and multi-digit reduce', () => {
    expect(getDigitSum(0)).toBe(0);
    expect(getDigitSum(7)).toBe(7);
    expect(getDigitSum(10)).toBe(1);
    expect(getDigitSum(99)).toBe(18);
    expect(getDigitSum(12345)).toBe(15);
    expect(getDigitSum(-99)).toBe(18);
    expect(getDigitSum(-7)).toBe(7);
  });
});

describe('Wave 29 attr-math — getFactors / areCoprime', () => {
  it('factors of positives and abs of negatives; 1 and primes', () => {
    expect(getFactors(1)).toEqual([1]);
    expect(getFactors(2)).toEqual([1, 2]);
    expect(getFactors(12)).toEqual([1, 2, 3, 4, 6, 12]);
    expect(getFactors(-12)).toEqual([1, 2, 3, 4, 6, 12]);
    expect(getFactors(0)).toEqual([]); // loop 1..0 never runs
    expect(getFactors(16)).toEqual([1, 2, 4, 8, 16]);
  });

  it('coprime matrix including zeros and signs', () => {
    expect(areCoprime(1, 1)).toBe(true);
    expect(areCoprime(1, 99)).toBe(true);
    expect(areCoprime(8, 15)).toBe(true);
    expect(areCoprime(14, 21)).toBe(false);
    expect(areCoprime(-8, 15)).toBe(true);
    expect(areCoprime(-9, -28)).toBe(true);
    // gcd(0,5)=5 ≠ 1; gcd(0,1)=1; gcd(0,0)=0
    expect(areCoprime(0, 5)).toBe(false);
    expect(areCoprime(0, 1)).toBe(true);
    expect(areCoprime(0, 0)).toBe(false);
  });
});

describe('Wave 29 attr-math — createMathPiece field contracts', () => {
  it('builds consistent attribute bags for 1, 2, 10, 25, 30', () => {
    const cases: Array<{
      n: number;
      isPrime: boolean;
      isSquare: boolean;
      isEven: boolean;
      divisibleBy3: boolean;
      divisibleBy5: boolean;
    }> = [
      {
        n: 1,
        isPrime: false,
        isSquare: true,
        isEven: false,
        divisibleBy3: false,
        divisibleBy5: false,
      },
      {
        n: 2,
        isPrime: true,
        isSquare: false,
        isEven: true,
        divisibleBy3: false,
        divisibleBy5: false,
      },
      {
        n: 10,
        isPrime: false,
        isSquare: false,
        isEven: true,
        divisibleBy3: false,
        divisibleBy5: true,
      },
      {
        n: 25,
        isPrime: false,
        isSquare: true,
        isEven: false,
        divisibleBy3: false,
        divisibleBy5: true,
      },
      {
        n: 30,
        isPrime: false,
        isSquare: false,
        isEven: true,
        divisibleBy3: true,
        divisibleBy5: true,
      },
    ];

    for (const c of cases) {
      const piece = createMathPiece(c.n);
      expect(piece.id).toBe(`num-${c.n}`);
      expect(piece.attributes.number).toBe(c.n);
      expect(piece.attributes.isPrime).toBe(c.isPrime);
      expect(piece.attributes.isSquare).toBe(c.isSquare);
      expect(piece.attributes.isEven).toBe(c.isEven);
      expect(piece.attributes.divisibleBy3).toBe(c.divisibleBy3);
      expect(piece.attributes.divisibleBy5).toBe(c.divisibleBy5);
      expect(piece.attributes.digitSum).toBe(getDigitSum(c.n));
      expect(piece.attributes.factorCount).toBe(getFactors(c.n).length);
    }
  });

  it('even zero and negative number contracts', () => {
    const zero = createMathPiece(0);
    expect(zero.attributes.isEven).toBe(true);
    expect(zero.attributes.isPrime).toBe(false);
    expect(zero.attributes.isSquare).toBe(true);
    expect(zero.attributes.factorCount).toBe(0);

    const neg = createMathPiece(-9);
    expect(neg.id).toBe('num--9');
    expect(neg.attributes.isPrime).toBe(false);
    expect(neg.attributes.isSquare).toBe(false); // isPerfectSquare(-9) false
    expect(neg.attributes.digitSum).toBe(9);
    expect(neg.attributes.isEven).toBe(false); // -9 % 2 === -1 in JS, not 0
    expect(neg.attributes.divisibleBy3).toBe(true);
    expect(neg.attributes.factorCount).toBe(getFactors(-9).length);
  });
});
