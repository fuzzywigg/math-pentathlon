// Fraction Arithmetic Operations

import {
  Fraction,
  MixedNumber,
  FractionOperation,
  FractionOperationResult,
  ComparisonResult,
} from './types';

/**
 * Calculate the Greatest Common Divisor using Euclidean algorithm
 */
export function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));

  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }

  return a;
}

/**
 * Calculate the Least Common Multiple
 */
export function lcm(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));

  if (a === 0 || b === 0) return 0;

  return (a * b) / gcd(a, b);
}

/**
 * Create a fraction from numerator and denominator
 */
export function createFraction(numerator: number, denominator: number): Fraction {
  if (denominator === 0) {
    throw new Error('Denominator cannot be zero');
  }

  // Ensure denominator is positive
  if (denominator < 0) {
    numerator = -numerator;
    denominator = -denominator;
  }

  return { numerator, denominator };
}

/**
 * Create a fraction from a whole number
 */
export function fromWhole(whole: number): Fraction {
  return { numerator: whole, denominator: 1 };
}

/**
 * Create a fraction from a decimal (with limited precision)
 */
export function fromDecimal(decimal: number, maxDenominator: number = 1000): Fraction {
  if (Number.isInteger(decimal)) {
    return fromWhole(decimal);
  }

  const sign = decimal < 0 ? -1 : 1;
  decimal = Math.abs(decimal);

  // Try common denominators first
  const commonDenoms = [2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 100];
  for (const denom of commonDenoms) {
    const numer = decimal * denom;
    if (Math.abs(numer - Math.round(numer)) < 0.0001) {
      return simplify({ numerator: sign * Math.round(numer), denominator: denom });
    }
  }

  // Continued fraction approximation
  let h1 = 1, h2 = 0;
  let k1 = 0, k2 = 1;
  let b = decimal;

  do {
    const a = Math.floor(b);
    let temp = h1;
    h1 = a * h1 + h2;
    h2 = temp;
    temp = k1;
    k1 = a * k1 + k2;
    k2 = temp;
    b = 1 / (b - a);
  } while (k1 <= maxDenominator && Math.abs(decimal - h1 / k1) > 1e-10);

  return simplify({ numerator: sign * h1, denominator: k1 });
}

/**
 * Simplify a fraction to lowest terms
 */
export function simplify(fraction: Fraction): Fraction {
  const { numerator, denominator } = fraction;

  if (numerator === 0) {
    return { numerator: 0, denominator: 1 };
  }

  const divisor = gcd(numerator, denominator);

  return createFraction(numerator / divisor, denominator / divisor);
}

/**
 * Check if a fraction is in simplest form
 */
export function isSimplified(fraction: Fraction): boolean {
  return gcd(fraction.numerator, fraction.denominator) === 1;
}

/**
 * Check if two fractions are equivalent
 */
export function areEquivalent(a: Fraction, b: Fraction): boolean {
  const simplifiedA = simplify(a);
  const simplifiedB = simplify(b);

  return simplifiedA.numerator === simplifiedB.numerator &&
         simplifiedA.denominator === simplifiedB.denominator;
}

/**
 * Compare two fractions: returns -1 (a < b), 0 (a = b), or 1 (a > b)
 */
export function compare(a: Fraction, b: Fraction): ComparisonResult {
  const crossA = a.numerator * b.denominator;
  const crossB = b.numerator * a.denominator;

  if (crossA < crossB) return -1;
  if (crossA > crossB) return 1;
  return 0;
}

/**
 * Convert to decimal
 */
export function toDecimal(fraction: Fraction): number {
  return fraction.numerator / fraction.denominator;
}

/**
 * Convert to mixed number
 */
export function toMixedNumber(fraction: Fraction): MixedNumber {
  const { numerator, denominator } = fraction;
  const whole = Math.trunc(numerator / denominator);
  const remainder = Math.abs(numerator % denominator);

  return {
    whole,
    fraction: { numerator: remainder, denominator },
  };
}

/**
 * Convert from mixed number to improper fraction
 */
export function fromMixedNumber(mixed: MixedNumber): Fraction {
  const sign = mixed.whole < 0 ? -1 : 1;
  const absWhole = Math.abs(mixed.whole);
  const numerator = sign * (absWhole * mixed.fraction.denominator + mixed.fraction.numerator);

  return { numerator, denominator: mixed.fraction.denominator };
}

/**
 * Add two fractions
 */
export function add(a: Fraction, b: Fraction): Fraction {
  const commonDenom = lcm(a.denominator, b.denominator);
  const numerator = (a.numerator * (commonDenom / a.denominator)) +
                   (b.numerator * (commonDenom / b.denominator));

  return { numerator, denominator: commonDenom };
}

/**
 * Subtract two fractions (a - b)
 */
export function subtract(a: Fraction, b: Fraction): Fraction {
  const commonDenom = lcm(a.denominator, b.denominator);
  const numerator = (a.numerator * (commonDenom / a.denominator)) -
                   (b.numerator * (commonDenom / b.denominator));

  return { numerator, denominator: commonDenom };
}

/**
 * Multiply two fractions
 */
export function multiply(a: Fraction, b: Fraction): Fraction {
  return {
    numerator: a.numerator * b.numerator,
    denominator: a.denominator * b.denominator,
  };
}

/**
 * Divide two fractions (a ÷ b)
 */
export function divide(a: Fraction, b: Fraction): Fraction {
  if (b.numerator === 0) {
    throw new Error('Cannot divide by zero');
  }

  return multiply(a, { numerator: b.denominator, denominator: b.numerator });
}

/**
 * Get the reciprocal of a fraction
 */
export function reciprocal(fraction: Fraction): Fraction {
  if (fraction.numerator === 0) {
    throw new Error('Cannot get reciprocal of zero');
  }

  return createFraction(fraction.denominator, fraction.numerator);
}

/**
 * Negate a fraction
 */
export function negate(fraction: Fraction): Fraction {
  return { numerator: -fraction.numerator, denominator: fraction.denominator };
}

/**
 * Get absolute value of a fraction
 */
export function abs(fraction: Fraction): Fraction {
  return { numerator: Math.abs(fraction.numerator), denominator: fraction.denominator };
}

/**
 * Check if fraction is positive
 */
export function isPositive(fraction: Fraction): boolean {
  return fraction.numerator > 0;
}

/**
 * Check if fraction is negative
 */
export function isNegative(fraction: Fraction): boolean {
  return fraction.numerator < 0;
}

/**
 * Check if fraction is zero
 */
export function isZero(fraction: Fraction): boolean {
  return fraction.numerator === 0;
}

/**
 * Check if fraction represents a whole number
 */
export function isWholeNumber(fraction: Fraction): boolean {
  return fraction.numerator % fraction.denominator === 0;
}

/**
 * Perform an operation and return detailed result
 */
export function performOperation(
  a: Fraction,
  b: Fraction,
  operation: FractionOperation
): FractionOperationResult {
  let result: Fraction;
  const steps: string[] = [];

  const aStr = formatFraction(a);
  const bStr = formatFraction(b);

  switch (operation) {
    case 'add':
      steps.push(`${aStr} + ${bStr}`);
      if (a.denominator !== b.denominator) {
        const common = lcm(a.denominator, b.denominator);
        steps.push(`Find common denominator: ${common}`);
        const newA = { numerator: a.numerator * (common / a.denominator), denominator: common };
        const newB = { numerator: b.numerator * (common / b.denominator), denominator: common };
        steps.push(`${formatFraction(newA)} + ${formatFraction(newB)}`);
      }
      result = add(a, b);
      break;

    case 'subtract':
      steps.push(`${aStr} - ${bStr}`);
      if (a.denominator !== b.denominator) {
        const common = lcm(a.denominator, b.denominator);
        steps.push(`Find common denominator: ${common}`);
        const newA = { numerator: a.numerator * (common / a.denominator), denominator: common };
        const newB = { numerator: b.numerator * (common / b.denominator), denominator: common };
        steps.push(`${formatFraction(newA)} - ${formatFraction(newB)}`);
      }
      result = subtract(a, b);
      break;

    case 'multiply':
      steps.push(`${aStr} × ${bStr}`);
      steps.push(`(${a.numerator} × ${b.numerator}) / (${a.denominator} × ${b.denominator})`);
      result = multiply(a, b);
      break;

    case 'divide':
      steps.push(`${aStr} ÷ ${bStr}`);
      steps.push(`${aStr} × ${formatFraction(reciprocal(b))}`);
      result = divide(a, b);
      break;
  }

  const simplified = simplify(result);
  steps.push(`= ${formatFraction(result)}`);

  if (!areEquivalent(result, simplified) || result.denominator !== simplified.denominator) {
    steps.push(`= ${formatFraction(simplified)} (simplified)`);
  }

  return {
    result,
    simplified,
    decimal: toDecimal(simplified),
    steps,
  };
}

/**
 * Format a fraction as a string
 */
export function formatFraction(fraction: Fraction): string {
  if (fraction.denominator === 1) {
    return String(fraction.numerator);
  }
  return `${fraction.numerator}/${fraction.denominator}`;
}

/**
 * Format as mixed number string
 */
export function formatMixedNumber(fraction: Fraction): string {
  const mixed = toMixedNumber(fraction);

  if (mixed.whole === 0) {
    return formatFraction(mixed.fraction);
  }

  if (mixed.fraction.numerator === 0) {
    return String(mixed.whole);
  }

  return `${mixed.whole} ${formatFraction(mixed.fraction)}`;
}

/**
 * Parse a fraction from string (e.g., "3/4" or "1 1/2")
 */
export function parseFraction(str: string): Fraction | null {
  str = str.trim();

  // Try mixed number format "1 1/2"
  const mixedMatch = str.match(/^(-?\d+)\s+(\d+)\/(\d+)$/);
  if (mixedMatch) {
    const whole = parseInt(mixedMatch[1], 10);
    const numer = parseInt(mixedMatch[2], 10);
    const denom = parseInt(mixedMatch[3], 10);
    if (denom === 0) return null;
    return fromMixedNumber({ whole, fraction: { numerator: numer, denominator: denom } });
  }

  // Try simple fraction "3/4"
  const fractionMatch = str.match(/^(-?\d+)\/(\d+)$/);
  if (fractionMatch) {
    const numer = parseInt(fractionMatch[1], 10);
    const denom = parseInt(fractionMatch[2], 10);
    if (denom === 0) return null;
    return { numerator: numer, denominator: denom };
  }

  // Try whole number
  const wholeMatch = str.match(/^-?\d+$/);
  if (wholeMatch) {
    return fromWhole(parseInt(str, 10));
  }

  return null;
}

/**
 * Find equivalent fractions with different denominators
 */
export function findEquivalentFractions(
  fraction: Fraction,
  targetDenominators: number[]
): Fraction[] {
  const simplified = simplify(fraction);
  const results: Fraction[] = [];

  for (const denom of targetDenominators) {
    if (denom % simplified.denominator === 0) {
      const multiplier = denom / simplified.denominator;
      results.push({
        numerator: simplified.numerator * multiplier,
        denominator: denom,
      });
    }
  }

  return results;
}

/**
 * Get all factors of a number
 */
export function getFactors(n: number): number[] {
  n = Math.abs(n);
  const factors: number[] = [];

  for (let i = 1; i <= Math.sqrt(n); i++) {
    if (n % i === 0) {
      factors.push(i);
      if (i !== n / i) {
        factors.push(n / i);
      }
    }
  }

  return factors.sort((a, b) => a - b);
}
