// Fraction System Types

/** A fraction represented as numerator/denominator */
export interface Fraction {
  numerator: number;
  denominator: number;
}

/** A mixed number (whole + fraction) */
export interface MixedNumber {
  whole: number;
  fraction: Fraction;
}

/** Visual representation style for fraction bars */
export type FractionBarStyle = 'horizontal' | 'vertical' | 'circle';

/** Color scheme for fraction bars */
export interface FractionBarColors {
  filled: string;
  empty: string;
  border: string;
}

/** Configuration for fraction bar rendering */
export interface FractionBarConfig {
  /** Visual style */
  style?: FractionBarStyle;
  /** Width in pixels */
  width?: number;
  /** Height in pixels */
  height?: number;
  /** Colors */
  colors?: Partial<FractionBarColors>;
  /** Show numeric label */
  showLabel?: boolean;
  /** Label position */
  labelPosition?: 'inside' | 'below' | 'right';
  /** Interactive (clickable segments) */
  interactive?: boolean;
}

/** Default color schemes for common fraction denominators */
export const FRACTION_COLORS: Record<number, string> = {
  1: '#f44336',   // Red - whole
  2: '#e91e63',   // Pink - halves
  3: '#9c27b0',   // Purple - thirds
  4: '#673ab7',   // Deep Purple - quarters
  5: '#3f51b5',   // Indigo - fifths
  6: '#2196f3',   // Blue - sixths
  8: '#00bcd4',   // Cyan - eighths
  10: '#009688',  // Teal - tenths
  12: '#4caf50',  // Green - twelfths
};

/** Common fractions used in Math Pentathlon */
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
  { numerator: 1, denominator: 12 },
  { numerator: 5, denominator: 12 },
  { numerator: 7, denominator: 12 },
  { numerator: 11, denominator: 12 },
];

/** Fraction bar piece for visual manipulation */
export interface FractionBarPiece {
  id: string;
  fraction: Fraction;
  color: string;
  label?: string;
}

/** Result of a fraction operation */
export interface FractionOperationResult {
  result: Fraction;
  simplified: Fraction;
  decimal: number;
  steps?: string[];
}

/** Supported arithmetic operations */
export type FractionOperation = 'add' | 'subtract' | 'multiply' | 'divide';

/** Comparison result */
export type ComparisonResult = -1 | 0 | 1;
