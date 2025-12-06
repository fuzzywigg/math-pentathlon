/**
 * Fraction System Unit Tests
 */

import { describe, it, expect } from 'vitest';
import {
  // Utility functions
  gcd,
  lcm,
  // Creation
  createFraction,
  fromWhole,
  fromDecimal,
  fromMixedNumber,
  // Simplification
  simplify,
  isSimplified,
  toMixedNumber,
  toDecimal,
  // Arithmetic
  add,
  subtract,
  multiply,
  divide,
  reciprocal,
  negate,
  abs,
  // Comparison
  compare,
  areEqual,
  areEquivalent,
  // LCD operations
  findLCD,
  toCommonDenominator,
  // Predicates
  isProper,
  isWholeNumber,
  isZero,
  isPositive,
  isNegative,
  // Aggregates
  min,
  max,
  sum,
  average,
  power,
  roundToDenominator,
  findEquivalentFractions,
  // Display
  formatFraction,
} from '../../src/core/fractions';

describe('gcd', () => {
  it('should calculate GCD correctly', () => {
    expect(gcd(12, 8)).toBe(4);
    expect(gcd(15, 25)).toBe(5);
    expect(gcd(17, 13)).toBe(1); // Coprime
    expect(gcd(0, 5)).toBe(5);
    expect(gcd(5, 0)).toBe(5);
  });

  it('should handle negative numbers', () => {
    expect(gcd(-12, 8)).toBe(4);
    expect(gcd(12, -8)).toBe(4);
    expect(gcd(-12, -8)).toBe(4);
  });
});

describe('lcm', () => {
  it('should calculate LCM correctly', () => {
    expect(lcm(4, 6)).toBe(12);
    expect(lcm(3, 5)).toBe(15);
    expect(lcm(2, 8)).toBe(8);
  });

  it('should handle zero', () => {
    expect(lcm(0, 5)).toBe(0);
    expect(lcm(5, 0)).toBe(0);
  });
});

describe('createFraction', () => {
  it('should create a fraction', () => {
    const f = createFraction(3, 4);
    expect(f.numerator).toBe(3);
    expect(f.denominator).toBe(4);
  });

  it('should throw on zero denominator', () => {
    expect(() => createFraction(1, 0)).toThrow();
  });
});

describe('fromWhole', () => {
  it('should create a fraction from whole number', () => {
    const f = fromWhole(5);
    expect(f.numerator).toBe(5);
    expect(f.denominator).toBe(1);
  });
});

describe('fromDecimal', () => {
  it('should convert simple decimals', () => {
    const f = fromDecimal(0.5);
    expect(areEqual(f, createFraction(1, 2))).toBe(true);
  });

  it('should convert common decimals', () => {
    expect(areEqual(fromDecimal(0.25), createFraction(1, 4))).toBe(true);
    expect(areEqual(fromDecimal(0.75), createFraction(3, 4))).toBe(true);
  });

  it('should handle whole numbers', () => {
    const f = fromDecimal(3);
    expect(f.numerator).toBe(3);
    expect(f.denominator).toBe(1);
  });

  it('should handle negative decimals', () => {
    const f = fromDecimal(-0.5);
    expect(toDecimal(f)).toBeCloseTo(-0.5);
  });
});

describe('fromMixedNumber', () => {
  it('should convert mixed number to fraction', () => {
    const f = fromMixedNumber(2, 1, 4); // 2 1/4 = 9/4
    expect(areEqual(f, createFraction(9, 4))).toBe(true);
  });

  it('should handle negative mixed numbers', () => {
    const f = fromMixedNumber(-2, 1, 4); // -2 1/4 = -9/4
    expect(areEqual(f, createFraction(-9, 4))).toBe(true);
  });
});

describe('simplify', () => {
  it('should simplify fractions', () => {
    const f = simplify(createFraction(6, 8));
    expect(f.numerator).toBe(3);
    expect(f.denominator).toBe(4);
    expect(f.isNegative).toBe(false);
  });

  it('should handle negative fractions', () => {
    const f = simplify(createFraction(-6, 8));
    expect(f.numerator).toBe(3);
    expect(f.denominator).toBe(4);
    expect(f.isNegative).toBe(true);
  });

  it('should normalize sign to numerator', () => {
    const f = simplify(createFraction(6, -8));
    expect(f.numerator).toBe(3);
    expect(f.denominator).toBe(4);
    expect(f.isNegative).toBe(true);
  });
});

describe('isSimplified', () => {
  it('should detect simplified fractions', () => {
    expect(isSimplified(createFraction(3, 4))).toBe(true);
    expect(isSimplified(createFraction(1, 2))).toBe(true);
  });

  it('should detect non-simplified fractions', () => {
    expect(isSimplified(createFraction(2, 4))).toBe(false);
    expect(isSimplified(createFraction(6, 9))).toBe(false);
  });
});

describe('toMixedNumber', () => {
  it('should convert improper fraction to mixed number', () => {
    const mixed = toMixedNumber(createFraction(7, 4));
    expect(mixed.whole).toBe(1);
    expect(mixed.fraction.numerator).toBe(3);
    expect(mixed.fraction.denominator).toBe(4);
  });

  it('should handle proper fractions', () => {
    const mixed = toMixedNumber(createFraction(3, 4));
    expect(mixed.whole).toBe(0);
    expect(mixed.fraction.numerator).toBe(3);
  });
});

describe('toDecimal', () => {
  it('should convert fraction to decimal', () => {
    expect(toDecimal(createFraction(1, 2))).toBe(0.5);
    expect(toDecimal(createFraction(1, 4))).toBe(0.25);
    expect(toDecimal(createFraction(3, 4))).toBe(0.75);
  });
});

describe('add', () => {
  it('should add fractions with same denominator', () => {
    const result = add(createFraction(1, 4), createFraction(2, 4));
    expect(areEqual(result, createFraction(3, 4))).toBe(true);
  });

  it('should add fractions with different denominators', () => {
    const result = add(createFraction(1, 2), createFraction(1, 3));
    expect(areEqual(result, createFraction(5, 6))).toBe(true);
  });

  it('should simplify result', () => {
    const result = add(createFraction(1, 4), createFraction(1, 4));
    expect(result.numerator).toBe(1);
    expect(result.denominator).toBe(2);
  });
});

describe('subtract', () => {
  it('should subtract fractions', () => {
    const result = subtract(createFraction(3, 4), createFraction(1, 4));
    expect(areEqual(result, createFraction(1, 2))).toBe(true);
  });

  it('should handle negative results', () => {
    const result = subtract(createFraction(1, 4), createFraction(3, 4));
    expect(areEqual(result, createFraction(-1, 2))).toBe(true);
  });
});

describe('multiply', () => {
  it('should multiply fractions', () => {
    const result = multiply(createFraction(2, 3), createFraction(3, 4));
    expect(areEqual(result, createFraction(1, 2))).toBe(true);
  });

  it('should handle multiplication by whole', () => {
    const result = multiply(createFraction(1, 2), fromWhole(3));
    expect(areEqual(result, createFraction(3, 2))).toBe(true);
  });
});

describe('divide', () => {
  it('should divide fractions', () => {
    const result = divide(createFraction(1, 2), createFraction(2, 3));
    expect(areEqual(result, createFraction(3, 4))).toBe(true);
  });

  it('should throw when dividing by zero', () => {
    expect(() => divide(createFraction(1, 2), createFraction(0, 1))).toThrow();
  });
});

describe('reciprocal', () => {
  it('should return reciprocal', () => {
    const result = reciprocal(createFraction(3, 4));
    expect(result.numerator).toBe(4);
    expect(result.denominator).toBe(3);
  });

  it('should throw for zero', () => {
    expect(() => reciprocal(createFraction(0, 1))).toThrow();
  });
});

describe('negate', () => {
  it('should negate positive fraction', () => {
    const result = negate(createFraction(3, 4));
    expect(result.numerator).toBe(-3);
  });

  it('should negate negative fraction', () => {
    const result = negate(createFraction(-3, 4));
    expect(result.numerator).toBe(3);
  });
});

describe('abs', () => {
  it('should return absolute value', () => {
    const result = abs(createFraction(-3, 4));
    expect(result.numerator).toBe(3);
    expect(result.denominator).toBe(4);
  });
});

describe('compare', () => {
  it('should return -1 when a < b', () => {
    expect(compare(createFraction(1, 4), createFraction(1, 2))).toBe(-1);
  });

  it('should return 0 when a = b', () => {
    expect(compare(createFraction(1, 2), createFraction(2, 4))).toBe(0);
  });

  it('should return 1 when a > b', () => {
    expect(compare(createFraction(3, 4), createFraction(1, 2))).toBe(1);
  });
});

describe('areEqual', () => {
  it('should detect equal fractions', () => {
    expect(areEqual(createFraction(1, 2), createFraction(2, 4))).toBe(true);
  });

  it('should detect unequal fractions', () => {
    expect(areEqual(createFraction(1, 2), createFraction(1, 3))).toBe(false);
  });
});

describe('areEquivalent', () => {
  it('should detect equivalent fractions', () => {
    expect(areEquivalent(createFraction(2, 4), createFraction(3, 6))).toBe(true);
  });

  it('should detect non-equivalent fractions', () => {
    expect(areEquivalent(createFraction(1, 2), createFraction(1, 3))).toBe(false);
  });
});

describe('findLCD', () => {
  it('should find LCD of multiple fractions', () => {
    expect(
      findLCD(createFraction(1, 2), createFraction(1, 3), createFraction(1, 4))
    ).toBe(12);
  });
});

describe('toCommonDenominator', () => {
  it('should convert to common denominator', () => {
    const [a, b] = toCommonDenominator(createFraction(1, 2), createFraction(1, 3));
    expect(a.denominator).toBe(b.denominator);
    expect(a.denominator).toBe(6);
    expect(a.numerator).toBe(3);
    expect(b.numerator).toBe(2);
  });
});

describe('predicates', () => {
  it('isProper should detect proper fractions', () => {
    expect(isProper(createFraction(1, 2))).toBe(true);
    expect(isProper(createFraction(5, 4))).toBe(false);
  });

  it('isWholeNumber should detect whole numbers', () => {
    expect(isWholeNumber(createFraction(4, 2))).toBe(true);
    expect(isWholeNumber(createFraction(3, 2))).toBe(false);
  });

  it('isZero should detect zero', () => {
    expect(isZero(createFraction(0, 5))).toBe(true);
    expect(isZero(createFraction(1, 5))).toBe(false);
  });

  it('isPositive should detect positive fractions', () => {
    expect(isPositive(createFraction(1, 2))).toBe(true);
    expect(isPositive(createFraction(-1, 2))).toBe(false);
  });

  it('isNegative should detect negative fractions', () => {
    expect(isNegative(createFraction(-1, 2))).toBe(true);
    expect(isNegative(createFraction(1, -2))).toBe(true);
    expect(isNegative(createFraction(1, 2))).toBe(false);
  });
});

describe('aggregates', () => {
  it('min should find minimum', () => {
    const result = min(createFraction(1, 2), createFraction(1, 3), createFraction(1, 4));
    expect(areEqual(result, createFraction(1, 4))).toBe(true);
  });

  it('max should find maximum', () => {
    const result = max(createFraction(1, 2), createFraction(1, 3), createFraction(1, 4));
    expect(areEqual(result, createFraction(1, 2))).toBe(true);
  });

  it('sum should add all fractions', () => {
    const result = sum([createFraction(1, 4), createFraction(1, 4), createFraction(1, 2)]);
    expect(areEqual(result, createFraction(1, 1))).toBe(true);
  });

  it('average should calculate mean', () => {
    const result = average([createFraction(1, 2), createFraction(1, 2)]);
    expect(areEqual(result, createFraction(1, 2))).toBe(true);
  });
});

describe('power', () => {
  it('should raise to positive power', () => {
    const result = power(createFraction(2, 3), 2);
    expect(areEqual(result, createFraction(4, 9))).toBe(true);
  });

  it('should handle power of 0', () => {
    const result = power(createFraction(2, 3), 0);
    expect(areEqual(result, fromWhole(1))).toBe(true);
  });

  it('should handle negative power', () => {
    const result = power(createFraction(2, 3), -1);
    expect(areEqual(result, createFraction(3, 2))).toBe(true);
  });
});

describe('roundToDenominator', () => {
  it('should round to target denominator', () => {
    const result = roundToDenominator(createFraction(1, 3), 8);
    // 1/3 ≈ 0.333... rounds to 3/8 = 0.375
    expect(result.denominator).toBe(8);
    expect(result.numerator).toBe(3);
  });
});

describe('findEquivalentFractions', () => {
  it('should find all equivalent fractions', () => {
    const equivalents = findEquivalentFractions(createFraction(1, 2), 10);
    expect(equivalents).toHaveLength(5); // 1/2, 2/4, 3/6, 4/8, 5/10
    expect(equivalents[0]).toEqual({ numerator: 1, denominator: 2 });
    expect(equivalents[4]).toEqual({ numerator: 5, denominator: 10 });
  });
});

describe('formatFraction', () => {
  it('should format basic fraction', () => {
    expect(formatFraction(createFraction(3, 4))).toBe('3/4');
  });

  it('should format with simplification', () => {
    expect(formatFraction(createFraction(4, 8), { simplify: true })).toBe('1/2');
  });

  it('should format as mixed number', () => {
    expect(formatFraction(createFraction(5, 4), { showMixedNumber: true })).toBe('1 1/4');
  });

  it('should format negative fractions', () => {
    expect(formatFraction(createFraction(-3, 4))).toBe('-3/4');
  });

  it('should use unicode when available', () => {
    expect(formatFraction(createFraction(1, 2), { useUnicodeFractions: true })).toBe('½');
  });
});
