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
 * Normalize a fraction: convert isNegative flag to negative numerator
 * for consistent arithmetic
 */
function toStandardForm(f: Fraction): Fraction {
  if (f.isNegative === true) {
    return { numerator: -Math.abs(f.numerator), denominator: f.denominator };
  }
  return f;
}

/**
 * Get the effective signed numerator (handles both isNegative flag and negative numerator)
 */
function signedNumerator(f: Fraction): number {
  if (f.isNegative === true) return -Math.abs(f.numerator);
  return f.numerator;
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
 * Simplify a fraction to lowest terms.
 * Returns positive numerator and denominator; sign is expressed via isNegative.
 */
export function simplify(fraction: Fraction): Fraction {
  const num = signedNumerator(fraction);
  const { denominator } = fraction;

  if (num === 0) {
    return { numerator: 0, denominator: 1, isNegative: false };
  }

  const negative = num < 0;
  const absNum = Math.abs(num);
  const divisor = gcd(absNum, denominator);

  return {
    numerator: absNum / divisor,
    denominator: denominator / divisor,
    isNegative: negative,
  };
}

/**
 * Check if a fraction is in simplest form
 */
export function isSimplified(fraction: Fraction): boolean {
  return gcd(Math.abs(fraction.numerator), fraction.denominator) === 1;
}

/**
 * Check if two fractions are numerically equal (handles both negative-numerator
 * and isNegative-flag styles)
 */
export function areEqual(a: Fraction, b: Fraction): boolean {
  const aN = signedNumerator(a);
  const bN = signedNumerator(b);
  return aN * b.denominator === bN * a.denominator;
}

/**
 * Check if two fractions are equivalent (same value after simplification)
 */
export function areEquivalent(a: Fraction, b: Fraction): boolean {
  return areEqual(a, b);
}

/**
 * Compare two fractions: returns -1 (a < b), 0 (a = b), or 1 (a > b)
 */
export function compare(a: Fraction, b: Fraction): ComparisonResult {
  const crossA = signedNumerator(a) * b.denominator;
  const crossB = signedNumerator(b) * a.denominator;

  if (crossA < crossB) return -1;
  if (crossA > crossB) return 1;
  return 0;
}

/**
 * Convert to decimal
 */
export function toDecimal(fraction: Fraction): number {
  const value = fraction.numerator / fraction.denominator;
  return fraction.isNegative === true ? -value : value;
}

/**
 * Convert to mixed number
 */
export function toMixedNumber(fraction: Fraction): MixedNumber {
  const num = signedNumerator(fraction);
  const { denominator } = fraction;
  const whole = Math.trunc(num / denominator);
  const remainder = Math.abs(num % denominator);

  return {
    whole,
    fraction: { numerator: remainder, denominator },
  };
}

/**
 * Convert from mixed number to improper fraction.
 * New signature: fromMixedNumber(whole, numerator, denominator)
 */
export function fromMixedNumber(whole: number, numerator: number, denominator: number): Fraction {
  const sign = whole < 0 ? -1 : 1;
  const absWhole = Math.abs(whole);
  const num = sign * (absWhole * denominator + numerator);
  return { numerator: num, denominator };
}

/**
 * Add two fractions (result is auto-simplified)
 */
export function add(a: Fraction, b: Fraction): Fraction {
  const na = toStandardForm(a);
  const nb = toStandardForm(b);
  const commonDenom = lcm(na.denominator, nb.denominator);
  const numerator =
    na.numerator * (commonDenom / na.denominator) +
    nb.numerator * (commonDenom / nb.denominator);
  return simplify({ numerator, denominator: commonDenom });
}

/**
 * Subtract two fractions (a - b)
 */
export function subtract(a: Fraction, b: Fraction): Fraction {
  const na = toStandardForm(a);
  const nb = toStandardForm(b);
  const commonDenom = lcm(na.denominator, nb.denominator);
  const numerator =
    na.numerator * (commonDenom / na.denominator) -
    nb.numerator * (commonDenom / nb.denominator);
  return { numerator, denominator: commonDenom };
}

/**
 * Multiply two fractions
 */
export function multiply(a: Fraction, b: Fraction): Fraction {
  const na = toStandardForm(a);
  const nb = toStandardForm(b);
  return {
    numerator: na.numerator * nb.numerator,
    denominator: na.denominator * nb.denominator,
  };
}

/**
 * Divide two fractions (a ÷ b)
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
export function reciprocal(fraction: Fraction): Fraction {
  if (fraction.numerator === 0) {
    throw new Error('Cannot get reciprocal of zero');
  }
  const f = toStandardForm(fraction);
  return createFraction(f.denominator, f.numerator);
}

/**
 * Negate a fraction (returns negative-numerator style for backward compatibility)
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
  if (fraction.isNegative === true) return false;
  return fraction.numerator > 0;
}

/**
 * Check if fraction is negative
 */
export function isNegative(fraction: Fraction): boolean {
  if (fraction.isNegative === true) return true;
  return fraction.numerator < 0;
}

/**
 * Check if fraction is zero
 */
export function isZero(fraction: Fraction): boolean {
  return fraction.numerator === 0;
}

/**
 * Check if fraction is a proper fraction (|numerator| < denominator)
 */
export function isProper(fraction: Fraction): boolean {
  return Math.abs(fraction.numerator) < fraction.denominator;
}

/**
 * Check if fraction represents a whole number
 */
export function isWholeNumber(fraction: Fraction): boolean {
  return fraction.numerator % fraction.denominator === 0;
}

/**
 * Find the LCD (Least Common Denominator) of multiple fractions
 */
export function findLCD(...fractions: Fraction[]): number {
  return fractions.reduce((acc, f) => lcm(acc, f.denominator), fractions[0]?.denominator ?? 1);
}

/**
 * Convert all fractions to a common denominator
 */
export function toCommonDenominator(...fractions: Fraction[]): Fraction[] {
  const lcd = findLCD(...fractions);
  return fractions.map(f => {
    const na = toStandardForm(f);
    const multiplier = lcd / na.denominator;
    return { numerator: na.numerator * multiplier, denominator: lcd };
  });
}

/**
 * Return the minimum of several fractions
 */
export function min(...fractions: Fraction[]): Fraction {
  return fractions.reduce((acc, f) => (compare(f, acc) < 0 ? f : acc));
}

/**
 * Return the maximum of several fractions
 */
export function max(...fractions: Fraction[]): Fraction {
  return fractions.reduce((acc, f) => (compare(f, acc) > 0 ? f : acc));
}

/**
 * Sum an array of fractions
 */
export function sum(fractions: Fraction[]): Fraction {
  if (fractions.length === 0) return fromWhole(0);
  return fractions.reduce((acc, f) => add(acc, f));
}

/**
 * Average an array of fractions
 */
export function average(fractions: Fraction[]): Fraction {
  if (fractions.length === 0) throw new Error('Cannot average empty array');
  const total = sum(fractions);
  return divide(total, fromWhole(fractions.length));
}

/**
 * Raise a fraction to an integer power
 */
export function power(fraction: Fraction, exponent: number): Fraction {
  if (exponent === 0) return fromWhole(1);
  if (exponent < 0) return power(reciprocal(fraction), -exponent);
  const f = toStandardForm(fraction);
  return {
    numerator: Math.pow(f.numerator, exponent),
    denominator: Math.pow(f.denominator, exponent),
  };
}

/**
 * Round a fraction to the nearest value with a given denominator
 */
export function roundToDenominator(fraction: Fraction, targetDenominator: number): Fraction {
  const value = toDecimal(fraction);
  const numerator = Math.round(value * targetDenominator);
  return { numerator, denominator: targetDenominator };
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

  if (!areEqual(result, simplified) || result.denominator !== simplified.denominator) {
    steps.push(`= ${formatFraction(simplified)} (simplified)`);
  }

  return {
    result,
    simplified,
    decimal: toDecimal(simplified),
    steps,
  };
}

/** Unicode fraction map */
const UNICODE_FRACTIONS: Record<string, string> = {
  '1/2': '½', '1/3': '⅓', '2/3': '⅔', '1/4': '¼', '3/4': '¾',
  '1/5': '⅕', '2/5': '⅖', '3/5': '⅗', '4/5': '⅘', '1/6': '⅙',
  '5/6': '⅚', '1/7': '⅐', '1/8': '⅛', '3/8': '⅜', '5/8': '⅝',
  '7/8': '⅞', '1/9': '⅑', '1/10': '⅒',
};

export interface FormatFractionOptions {
  simplify?: boolean;
  showMixedNumber?: boolean;
  useUnicodeFractions?: boolean;
}

/**
 * Format a fraction as a string
 */
export function formatFraction(fraction: Fraction, options: FormatFractionOptions = {}): string {
  let f = fraction;

  if (options.simplify) {
    const s = simplify(f);
    // Convert back to standard negative-numerator form for display
    f = s.isNegative ? { numerator: -s.numerator, denominator: s.denominator } : { numerator: s.numerator, denominator: s.denominator };
  }

  // Determine sign and absolute values
  const neg = signedNumerator(f) < 0;
  const absNum = Math.abs(f.numerator);
  const denom = f.denominator;
  const prefix = neg ? '-' : '';

  if (denom === 1) {
    return `${prefix}${absNum}`;
  }

  if (options.showMixedNumber) {
    const whole = Math.floor(absNum / denom);
    const remainder = absNum % denom;
    if (whole === 0) {
      const basic = `${absNum}/${denom}`;
      if (options.useUnicodeFractions && UNICODE_FRACTIONS[basic]) return `${prefix}${UNICODE_FRACTIONS[basic]}`;
      return `${prefix}${basic}`;
    }
    if (remainder === 0) return `${prefix}${whole}`;
    const fracPart = `${remainder}/${denom}`;
    if (options.useUnicodeFractions && UNICODE_FRACTIONS[fracPart]) return `${prefix}${whole} ${UNICODE_FRACTIONS[fracPart]}`;
    return `${prefix}${whole} ${fracPart}`;
  }

  const basic = `${absNum}/${denom}`;
  if (options.useUnicodeFractions && UNICODE_FRACTIONS[basic]) return `${prefix}${UNICODE_FRACTIONS[basic]}`;
  return `${prefix}${basic}`;
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
    return fromMixedNumber(whole, numer, denom);
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
 * Find equivalent fractions up to maxDenominator.
 * Returns all multiples: (1*n)/(1*d), (2*n)/(2*d), ... up to maxDenominator.
 */
export function findEquivalentFractions(
  fraction: Fraction,
  maxDenominator: number
): Fraction[] {
  const s = simplify(fraction);
  const baseNum = s.isNegative ? -s.numerator : s.numerator;
  const baseDenom = s.denominator;
  const results: Fraction[] = [];

  for (let k = 1; k * baseDenom <= maxDenominator; k++) {
    results.push({ numerator: k * baseNum, denominator: k * baseDenom });
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
