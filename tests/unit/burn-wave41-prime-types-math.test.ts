/**
 * Wave 41 HEAVY — Prime Gold types math: isPrime / factorial /
 * generateExpressions / isGoldbachNumber deep matrices.
 */
import { describe, it, expect } from 'vitest';
import {
  isPrime,
  factorial,
  generateExpressions,
  isGoldbachNumber,
} from '../../src/games/prime-gold/types';

describe('Wave 41 Prime Gold — isPrime matrix', () => {
  it.each([
    [0, false],
    [1, false],
    [2, true],
    [3, true],
    [4, false],
    [5, true],
    [9, false],
    [11, true],
    [25, false],
    [29, true],
    [49, false],
    [47, true],
  ] as const)('isPrime(%i) → %s', (n, expected) => {
    expect(isPrime(n)).toBe(expected);
  });

  it('even numbers > 2 are never prime', () => {
    for (let n = 4; n <= 48; n += 2) {
      expect(isPrime(n)).toBe(false);
    }
  });
});

describe('Wave 41 Prime Gold — factorial edges', () => {
  it.each([
    [0, 1],
    [1, 1],
    [2, 2],
    [3, 6],
    [4, 24],
    [5, 120],
    [6, 720],
  ] as const)('factorial(%i) = %i', (n, expected) => {
    expect(factorial(n)).toBe(expected);
  });

  it.each([-1, -5, 11, 12, 100] as const)('factorial(%i) is NaN', (n) => {
    expect(factorial(n)).toBeNaN();
  });
});

describe('Wave 41 Prime Gold — generateExpressions matrix', () => {
  it('includes singles, factorials, and binary ops for 2,3,4', () => {
    const exprs = generateExpressions(2, 3, 4);
    const byValue = new Map(exprs.map((e) => [e.value, e.expr]));
    expect(byValue.has(2)).toBe(true);
    expect(byValue.has(3)).toBe(true);
    expect(byValue.has(4)).toBe(true);
    expect(byValue.has(6)).toBe(true);
    expect(byValue.has(24)).toBe(true);
    expect(byValue.has(5)).toBe(true);
    expect(exprs.every((e) => e.value >= 1 && e.value <= 49)).toBe(true);
    expect(exprs.every((e) => Number.isInteger(e.value))).toBe(true);
  });

  it('dedupes values — one entry per reachable integer', () => {
    const exprs = generateExpressions(1, 1, 1);
    const values = exprs.map((e) => e.value);
    expect(new Set(values).size).toBe(values.length);
  });

  it('results are sorted ascending by value', () => {
    const exprs = generateExpressions(5, 6, 7);
    for (let i = 1; i < exprs.length; i++) {
      expect(exprs[i].value).toBeGreaterThanOrEqual(exprs[i - 1].value);
    }
  });

  it('excludes zero, negatives, and values > 49', () => {
    const exprs = generateExpressions(6, 8, 10);
    expect(exprs.every((e) => e.value > 0 && e.value <= 49)).toBe(true);
    expect(exprs.some((e) => e.value === 0)).toBe(false);
  });

  it('factorial die faces expand reachability vs raw dice alone', () => {
    const withFact = generateExpressions(3, 1, 1).map((e) => e.value);
    expect(withFact).toContain(6);
  });
});

describe('Wave 41 Prime Gold — isGoldbachNumber matrix', () => {
  it.each([
    [4, true],
    [6, true],
    [8, true],
    [10, true],
    [12, true],
    [20, true],
    [28, true],
  ] as const)('even %i is Goldbach', (n, expected) => {
    expect(isGoldbachNumber(n)).toBe(expected);
  });

  it.each([1, 2, 3, 5, 7, 9, 15, 21] as const)(
    'rejects non-Goldbach candidate %i',
    (n) => {
      expect(isGoldbachNumber(n)).toBe(false);
    }
  );

  it('every even in (2, 50] satisfies Goldbach under board primes', () => {
    for (let n = 4; n <= 50; n += 2) {
      expect(isGoldbachNumber(n)).toBe(true);
    }
  });
});
