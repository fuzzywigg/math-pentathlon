/**
 * Fraction Arithmetic
 * Core mathematical operations on fractions
 */

import type { Fraction, SimplifiedFraction, MixedNumber, ComparisonResult } from './types';

/**
 * Calculate Greatest Common Divisor using Euclidean algorithm
 */
export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

/**
 * Calculate Least Common Multiple
 */
export function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / gcd(a, b);
}

/**
 * Create a fraction from numerator and denominator
 */
export function createFraction(numerator: number, denominator: number): Fraction {
  if (denominator === 0) {
    throw new Error('Denominator cannot be zero');
  }
  return { numerator, denominator };
}

/**
 * Create a fraction from a whole number
 */
export function fromWhole(n: number): Fraction {
  return { numerator: n, denominator: 1 };
}

/**
 * Create a fraction from a decimal (with optional max denominator)
 */
export function fromDecimal(decimal: number, maxDenominator: number = 1000): Fraction {
  if (Number.isInteger(decimal)) {
    return fromWhole(decimal);
  }

  const sign = decimal < 0 ? -1 : 1;
  decimal = Math.abs(decimal);

  // Use continued fraction algorithm for best rational approximation
  let h1 = 1, h2 = 0;
  let k1 = 0, k2 = 1;
  let b = decimal;

  while (k1 <= maxDenominator) {
    const a = Math.floor(b);
    const aux = h1;
    h1 = a * h1 + h2;
    h2 = aux;
    const auxK = k1;
    k1 = a * k1 + k2;
    k2 = auxK;

    if (b === a) break; // Exact representation found

    b = 1 / (b - a);

    if (k1 > maxDenominator) {
      // Revert to previous convergent
      return toFraction(simplify({ numerator: sign * h2, denominator: k2 }));
    }
  }

  return toFraction(simplify({ numerator: sign * h1, denominator: k1 }));
}

/**
 * Create a fraction from a mixed number
 */
export function fromMixedNumber(whole: number, numerator: number, denominator: number): Fraction {
  if (denominator === 0) {
    throw new Error('Denominator cannot be zero');
  }
  const sign = whole < 0 ? -1 : 1;
  const totalNumerator = sign * (Math.abs(whole) * denominator + numerator);
  return { numerator: totalNumerator, denominator };
}

/**
 * Simplify a fraction to lowest terms
 * Returns a SimplifiedFraction with absolute numerator/denominator and isNegative flag
 */
export function simplify(f: Fraction): SimplifiedFraction {
  if (f.denominator === 0) {
    throw new Error('Denominator cannot be zero');
  }

  const divisor = gcd(f.numerator, f.denominator);
  let num = f.numerator / divisor;
  let den = f.denominator / divisor;

  // Normalize sign (store in isNegative flag, numerator/denominator always positive)
  const isNegative = (num < 0) !== (den < 0);
  num = Math.abs(num);
  den = Math.abs(den);

  return {
    numerator: num,
    denominator: den,
    isNegative,
  };
}

/**
 * Convert SimplifiedFraction back to Fraction with sign in numerator
 */
function toFraction(sf: SimplifiedFraction): Fraction {
  return {
    numerator: sf.isNegative ? -sf.numerator : sf.numerator,
    denominator: sf.denominator,
  };
}

/**
 * Check if a fraction is in simplest form
 */
export function isSimplified(f: Fraction): boolean {
  return gcd(Math.abs(f.numerator), Math.abs(f.denominator)) === 1;
}

/**
 * Convert to mixed number
 */
export function toMixedNumber(f: Fraction): MixedNumber {
  const simplified = simplify(f);
  const whole = Math.floor(simplified.numerator / simplified.denominator);
  const remainder = simplified.numerator % simplified.denominator;

  return {
    whole,
    fraction: { numerator: remainder, denominator: simplified.denominator },
    isNegative: simplified.isNegative,
  };
}

/**
 * Convert to decimal
 */
export function toDecimal(f: Fraction): number {
  if (f.denominator === 0) {
    throw new Error('Denominator cannot be zero');
  }
  return f.numerator / f.denominator;
}

/**
 * Add two fractions
 */
export function add(a: Fraction, b: Fraction): Fraction {
  const commonDenom = lcm(a.denominator, b.denominator);
  const newNumerator =
    a.numerator * (commonDenom / a.denominator) +
    b.numerator * (commonDenom / b.denominator);

  return toFraction(simplify({ numerator: newNumerator, denominator: commonDenom }));
}

/**
 * Subtract two fractions (a - b)
 */
export function subtract(a: Fraction, b: Fraction): Fraction {
  return add(a, negate(b));
}

/**
 * Multiply two fractions
 */
export function multiply(a: Fraction, b: Fraction): Fraction {
  return toFraction(simplify({
    numerator: a.numerator * b.numerator,
    denominator: a.denominator * b.denominator,
  }));
}

/**
 * Divide two fractions (a / b)
 */
export function divide(a: Fraction, b: Fraction): Fraction {
  if (b.numerator === 0) {
    throw new Error('Cannot divide by zero');
  }
  return multiply(a, reciprocal(b));
}

/**
 * Get the reciprocal of a fraction
 */
export function reciprocal(f: Fraction): Fraction {
  if (f.numerator === 0) {
    throw new Error('Cannot get reciprocal of zero');
  }
  return { numerator: f.denominator, denominator: f.numerator };
}

/**
 * Negate a fraction
 */
export function negate(f: Fraction): Fraction {
  return { numerator: -f.numerator, denominator: f.denominator };
}

/**
 * Get absolute value of a fraction
 */
export function abs(f: Fraction): Fraction {
  return {
    numerator: Math.abs(f.numerator),
    denominator: Math.abs(f.denominator),
  };
}

/**
 * Compare two fractions
 * Returns -1 if a < b, 0 if a = b, 1 if a > b
 */
export function compare(a: Fraction, b: Fraction): ComparisonResult {
  const diff = toDecimal(subtract(a, b));
  if (diff < 0) return -1;
  if (diff > 0) return 1;
  return 0;
}

/**
 * Check if two fractions are equal (equivalent)
 */
export function areEqual(a: Fraction, b: Fraction): boolean {
  return compare(a, b) === 0;
}

/**
 * Check if two fractions are equivalent (same value when simplified)
 */
export function areEquivalent(a: Fraction, b: Fraction): boolean {
  const simplifiedA = simplify(a);
  const simplifiedB = simplify(b);
  return (
    simplifiedA.numerator === simplifiedB.numerator &&
    simplifiedA.denominator === simplifiedB.denominator &&
    simplifiedA.isNegative === simplifiedB.isNegative
  );
}

/**
 * Find the Least Common Denominator of multiple fractions
 */
export function findLCD(...fractions: Fraction[]): number {
  if (fractions.length === 0) return 1;
  return fractions.reduce((acc, f) => lcm(acc, f.denominator), 1);
}

/**
 * Convert fractions to common denominator
 */
export function toCommonDenominator(...fractions: Fraction[]): Fraction[] {
  const commonDenom = findLCD(...fractions);
  return fractions.map((f) => ({
    numerator: f.numerator * (commonDenom / f.denominator),
    denominator: commonDenom,
  }));
}

/**
 * Check if a fraction is a proper fraction (|numerator| < |denominator|)
 */
export function isProper(f: Fraction): boolean {
  return Math.abs(f.numerator) < Math.abs(f.denominator);
}

/**
 * Check if a fraction is a whole number
 */
export function isWholeNumber(f: Fraction): boolean {
  return f.numerator % f.denominator === 0;
}

/**
 * Check if a fraction is zero
 */
export function isZero(f: Fraction): boolean {
  return f.numerator === 0;
}

/**
 * Check if a fraction is positive
 */
export function isPositive(f: Fraction): boolean {
  return (f.numerator > 0 && f.denominator > 0) || (f.numerator < 0 && f.denominator < 0);
}

/**
 * Check if a fraction is negative
 */
export function isNegative(f: Fraction): boolean {
  return (f.numerator > 0 && f.denominator < 0) || (f.numerator < 0 && f.denominator > 0);
}

/**
 * Get the minimum of multiple fractions
 */
export function min(...fractions: Fraction[]): Fraction {
  if (fractions.length === 0) {
    throw new Error('Cannot find minimum of empty array');
  }
  return fractions.reduce((minF, f) => (compare(f, minF) < 0 ? f : minF));
}

/**
 * Get the maximum of multiple fractions
 */
export function max(...fractions: Fraction[]): Fraction {
  if (fractions.length === 0) {
    throw new Error('Cannot find maximum of empty array');
  }
  return fractions.reduce((maxF, f) => (compare(f, maxF) > 0 ? f : maxF));
}

/**
 * Sum an array of fractions
 */
export function sum(fractions: Fraction[]): Fraction {
  if (fractions.length === 0) {
    return fromWhole(0);
  }
  return fractions.reduce((acc, f) => add(acc, f), fromWhole(0));
}

/**
 * Calculate the average of multiple fractions
 */
export function average(fractions: Fraction[]): Fraction {
  if (fractions.length === 0) {
    throw new Error('Cannot calculate average of empty array');
  }
  return divide(sum(fractions), fromWhole(fractions.length));
}

/**
 * Raise a fraction to an integer power
 */
export function power(f: Fraction, exponent: number): Fraction {
  if (!Number.isInteger(exponent)) {
    throw new Error('Exponent must be an integer');
  }

  if (exponent === 0) {
    return fromWhole(1);
  }

  if (exponent < 0) {
    return power(reciprocal(f), -exponent);
  }

  return toFraction(simplify({
    numerator: Math.pow(f.numerator, exponent),
    denominator: Math.pow(f.denominator, exponent),
  }));
}

/**
 * Round a fraction to the nearest fraction with given denominator
 */
export function roundToDenominator(f: Fraction, targetDenominator: number): Fraction {
  const decimal = toDecimal(f);
  const numerator = Math.round(decimal * targetDenominator);
  return toFraction(simplify({ numerator, denominator: targetDenominator }));
}

/**
 * Find all equivalent fractions up to a maximum denominator
 */
export function findEquivalentFractions(f: Fraction, maxDenominator: number): Fraction[] {
  const simplified = simplify(f);
  const result: Fraction[] = [];

  for (let multiplier = 1; simplified.denominator * multiplier <= maxDenominator; multiplier++) {
    result.push({
      numerator: (simplified.isNegative ? -1 : 1) * simplified.numerator * multiplier,
      denominator: simplified.denominator * multiplier,
    });
  }

  return result;
}
