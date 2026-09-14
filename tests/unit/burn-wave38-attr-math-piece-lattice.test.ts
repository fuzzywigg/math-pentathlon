/**
 * Wave 38 — createMathPiece dense lattice 0..120 + helper agreement.
 * Beyond wave 29 sample contracts. Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  isPrime,
  isPerfectSquare,
  getDigitSum,
  getFactors,
  createMathPiece,
} from '../../src/core/attributes/logic';

describe('Wave 38 attr-math — createMathPiece lattice 0..120', () => {
  it('every n agrees with helper predicates and factorCount', () => {
    for (let n = 0; n <= 120; n++) {
      const p = createMathPiece(n);
      expect(p.id).toBe(`num-${n}`);
      expect(p.attributes.number).toBe(n);
      expect(p.attributes.isPrime).toBe(isPrime(n));
      expect(p.attributes.isSquare).toBe(isPerfectSquare(n));
      expect(p.attributes.digitSum).toBe(getDigitSum(n));
      expect(p.attributes.isEven).toBe(n % 2 === 0);
      expect(p.attributes.divisibleBy3).toBe(n % 3 === 0);
      expect(p.attributes.divisibleBy5).toBe(n % 5 === 0);
      expect(p.attributes.factorCount).toBe(getFactors(n).length);
    }
  });

  it('prime count in 2..100 matches known 25', () => {
    let primes = 0;
    for (let n = 2; n <= 100; n++) if (isPrime(n)) primes++;
    expect(primes).toBe(25);
  });

  it('perfect squares in 0..100 are exactly 0..10 squared', () => {
    const squares = [];
    for (let n = 0; n <= 100; n++) if (isPerfectSquare(n)) squares.push(n);
    expect(squares).toEqual([0, 1, 4, 9, 16, 25, 36, 49, 64, 81, 100]);
  });
});

describe('Wave 38 attr-math — negative lattice contracts', () => {
  it('negatives keep digitSum/factors via abs; isSquare always false', () => {
    for (const n of [-1, -4, -9, -16, -25, -36, -49, -100]) {
      const p = createMathPiece(n);
      expect(p.attributes.isPrime).toBe(false);
      expect(p.attributes.isSquare).toBe(false);
      expect(p.attributes.digitSum).toBe(getDigitSum(n));
      expect(p.attributes.factorCount).toBe(getFactors(n).length);
      expect(p.attributes.divisibleBy3).toBe(n % 3 === 0);
      expect(p.attributes.divisibleBy5).toBe(n % 5 === 0);
    }
  });
});
