/**
 * Wave 39 — attributes math piece / prime / factors catalog leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  isPrime,
  isPerfectSquare,
  getDigitSum,
  getFactors,
  areCoprime,
  createMathPiece,
  groupByAttribute,
  getUniqueValues,
  sortByAttribute,
  BASIC_ATTRIBUTES,
  SOME_SUM_ATTRIBUTES,
  generateAllPieces,
  createPiece,
} from '../../src/core/attributes';

describe('Wave 39 attributes — math piece catalog', () => {
  it('prime / square / digit / factors / coprime matrix', () => {
    expect(isPrime(2)).toBe(true);
    expect(isPrime(1)).toBe(false);
    expect(isPrime(9)).toBe(false);
    expect(isPerfectSquare(16)).toBe(true);
    expect(isPerfectSquare(15)).toBe(false);
    expect(getDigitSum(128)).toBe(11);
    expect(getFactors(12)).toEqual([1, 2, 3, 4, 6, 12]);
    expect(areCoprime(8, 9)).toBe(true);
    expect(areCoprime(8, 12)).toBe(false);
  });

  it('createMathPiece attributes include number/isPrime/isSquare', () => {
    const p = createMathPiece(9);
    expect(p.attributes.number).toBe(9);
    expect(p.attributes.isPrime).toBe(false);
    expect(p.attributes.isSquare).toBe(true);
  });

  it('group / unique / sort helpers', () => {
    const pieces = [
      createPiece('1', { color: 'red', n: 2 }),
      createPiece('2', { color: 'blue', n: 1 }),
      createPiece('3', { color: 'red', n: 3 }),
    ];
    const grouped = groupByAttribute(pieces, 'color');
    expect(grouped.get('red')).toHaveLength(2);
    expect(getUniqueValues(pieces, 'color').sort()).toEqual(['blue', 'red']);
    expect(sortByAttribute(pieces, 'n').map((p) => p.id)).toEqual([
      '2',
      '1',
      '3',
    ]);
  });

  it('catalogs generate pieces', () => {
    expect(BASIC_ATTRIBUTES.length).toBeGreaterThan(0);
    expect(SOME_SUM_ATTRIBUTES.length).toBeGreaterThan(0);
    const all = generateAllPieces(BASIC_ATTRIBUTES.slice(0, 2));
    expect(all.length).toBeGreaterThan(0);
  });
});
