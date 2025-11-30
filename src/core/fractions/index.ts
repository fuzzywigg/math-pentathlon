/**
 * Fraction System
 * Reusable fraction representation, arithmetic, and visualization
 *
 * Used by: Fab-a-Diffy, Frac Fact, Fraction Pinball, Pent'em In
 */

// Types
export type {
  Fraction,
  SimplifiedFraction,
  MixedNumber,
  ComparisonResult,
  FractionBar,
  FractionDisplayOptions,
  FractionStyle,
} from './types';

export {
  FRACTION_BAR_COLORS,
  getFractionBarColor,
  DEFAULT_DECIMAL_PRECISION,
  COMMON_FRACTIONS,
  DEFAULT_DISPLAY_OPTIONS,
  UNICODE_FRACTIONS,
  DEFAULT_FRACTION_STYLE,
} from './types';

// Arithmetic operations
export {
  gcd,
  lcm,
  createFraction,
  fromWhole,
  fromDecimal,
  fromMixedNumber,
  simplify,
  isSimplified,
  toMixedNumber,
  toDecimal,
  add,
  subtract,
  multiply,
  divide,
  reciprocal,
  negate,
  abs,
  compare,
  areEqual,
  areEquivalent,
  findLCD,
  toCommonDenominator,
  isProper,
  isWholeNumber,
  isZero,
  isPositive,
  isNegative,
  min,
  max,
  sum,
  average,
  power,
  roundToDenominator,
  findEquivalentFractions,
} from './arithmetic';

// UI components
export {
  formatFraction,
  createFractionBar,
  renderFractionBar,
  renderFractionBars,
  renderFractionComparison,
  renderFractionCircle,
  renderFractionGrid,
  getFractionStyles,
  injectFractionStyles,
} from './fraction-bar-ui';
