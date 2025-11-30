/**
 * Fraction System Types
 * Core type definitions for fraction representation and operations
 */

// A fraction represented as numerator/denominator
export interface Fraction {
  numerator: number;
  denominator: number;
}

// Fraction in simplest form with sign
export interface SimplifiedFraction extends Fraction {
  isNegative: boolean;
}

// Mixed number representation (whole + fraction)
export interface MixedNumber {
  whole: number;
  fraction: Fraction;
  isNegative: boolean;
}

// Comparison result
export type ComparisonResult = -1 | 0 | 1;

// Fraction bar visual representation (Cuisenaire-style)
export interface FractionBar {
  fraction: Fraction;
  color: string;
  label?: string;
}

// Standard fraction bar colors (Cuisenaire rod inspired)
export const FRACTION_BAR_COLORS: Record<number, string> = {
  1: '#ffffff', // White - whole
  2: '#e53935', // Red - halves
  3: '#8bc34a', // Light green - thirds
  4: '#9c27b0', // Purple - quarters
  5: '#ffc107', // Yellow - fifths
  6: '#4caf50', // Dark green - sixths
  7: '#000000', // Black - sevenths
  8: '#795548', // Brown - eighths
  9: '#2196f3', // Blue - ninths
  10: '#ff9800', // Orange - tenths
  12: '#607d8b', // Blue-gray - twelfths
};

// Get color for a fraction bar based on denominator
export function getFractionBarColor(denominator: number): string {
  return FRACTION_BAR_COLORS[denominator] || '#9e9e9e'; // Gray fallback
}

// Decimal precision for conversions
export const DEFAULT_DECIMAL_PRECISION = 6;

// Common fractions for quick reference/validation
export const COMMON_FRACTIONS: Fraction[] = [
  { numerator: 1, denominator: 2 },
  { numerator: 1, denominator: 3 },
  { numerator: 2, denominator: 3 },
  { numerator: 1, denominator: 4 },
  { numerator: 3, denominator: 4 },
  { numerator: 1, denominator: 5 },
  { numerator: 2, denominator: 5 },
  { numerator: 3, denominator: 5 },
  { numerator: 4, denominator: 5 },
  { numerator: 1, denominator: 6 },
  { numerator: 5, denominator: 6 },
  { numerator: 1, denominator: 8 },
  { numerator: 3, denominator: 8 },
  { numerator: 5, denominator: 8 },
  { numerator: 7, denominator: 8 },
  { numerator: 1, denominator: 10 },
  { numerator: 3, denominator: 10 },
  { numerator: 7, denominator: 10 },
  { numerator: 9, denominator: 10 },
];

// Fraction display format options
export interface FractionDisplayOptions {
  showMixedNumber?: boolean; // Show 5/4 as 1 1/4
  showSign?: boolean; // Show + for positive
  useUnicodeFractions?: boolean; // Use ½ ⅓ etc. when available
  simplify?: boolean; // Always show in simplest form
}

// Default display options
export const DEFAULT_DISPLAY_OPTIONS: FractionDisplayOptions = {
  showMixedNumber: false,
  showSign: false,
  useUnicodeFractions: false,
  simplify: true,
};

// Unicode fraction characters
export const UNICODE_FRACTIONS: Record<string, string> = {
  '1/2': '\u00BD',
  '1/3': '\u2153',
  '2/3': '\u2154',
  '1/4': '\u00BC',
  '3/4': '\u00BE',
  '1/5': '\u2155',
  '2/5': '\u2156',
  '3/5': '\u2157',
  '4/5': '\u2158',
  '1/6': '\u2159',
  '5/6': '\u215A',
  '1/7': '\u2150',
  '1/8': '\u215B',
  '3/8': '\u215C',
  '5/8': '\u215D',
  '7/8': '\u215E',
  '1/9': '\u2151',
  '1/10': '\u2152',
};

// Visual style for fraction rendering
export interface FractionStyle {
  barHeight: number;
  barWidth: number;
  showLabel: boolean;
  showValue: boolean;
  borderRadius: number;
  borderWidth: number;
  borderColor: string;
  fontSize: number;
}

// Default visual style
export const DEFAULT_FRACTION_STYLE: FractionStyle = {
  barHeight: 40,
  barWidth: 200,
  showLabel: true,
  showValue: true,
  borderRadius: 4,
  borderWidth: 1,
  borderColor: '#333',
  fontSize: 14,
};
