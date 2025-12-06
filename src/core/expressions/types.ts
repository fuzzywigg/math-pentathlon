// Expression Builder Types
// Types for building and evaluating mathematical expressions

// =============================================================================
// Core Expression Types
// =============================================================================

/**
 * Supported operators in expressions
 */
export type Operator = '+' | '-' | '*' | '/' | '^' | '=' | '<' | '>' | '≤' | '≥';

/**
 * Arithmetic operators only
 */
export type ArithmeticOperator = '+' | '-' | '*' | '/';

/**
 * A token in an expression (number, operator, or parenthesis)
 */
export type ExpressionToken =
  | { type: 'number'; value: number }
  | { type: 'operator'; value: Operator }
  | { type: 'lparen' }
  | { type: 'rparen' }
  | { type: 'variable'; name: string };

/**
 * An expression node in the AST
 */
export type ExpressionNode =
  | { type: 'number'; value: number }
  | { type: 'variable'; name: string }
  | { type: 'binary'; operator: Operator; left: ExpressionNode; right: ExpressionNode }
  | { type: 'unary'; operator: '-'; operand: ExpressionNode };

/**
 * Result of evaluating an expression
 */
export interface EvaluationResult {
  success: boolean;
  value?: number;
  error?: string;
}

/**
 * Variables for expression evaluation
 */
export type VariableMap = Map<string, number>;

// =============================================================================
// Expression Builder Game Types
// =============================================================================

/**
 * A card/tile that can be placed to build expressions
 */
export interface ExpressionCard {
  id: string;
  content: string; // Display text ('3', '+', etc.)
  tokenType: 'number' | 'operator' | 'lparen' | 'rparen';
  value?: number; // For number cards
  operator?: Operator; // For operator cards
}

/**
 * A slot where cards can be placed
 */
export interface ExpressionSlot {
  id: string;
  index: number;
  card: ExpressionCard | null;
  locked?: boolean; // Some slots may be pre-filled
}

/**
 * An expression being built from cards
 */
export interface ExpressionBuilder {
  slots: ExpressionSlot[];
  targetValue?: number; // Optional target to reach
}

/**
 * Validation result for a built expression
 */
export interface ExpressionValidation {
  isValid: boolean;
  canEvaluate: boolean;
  result?: number;
  errors: string[];
}

// =============================================================================
// Target Game Types (like "24 Game" or "Countdown")
// =============================================================================

/**
 * A target number challenge
 */
export interface TargetChallenge {
  numbers: number[]; // Available numbers to use
  target: number; // Target to reach
  operators: Operator[]; // Allowed operators
  useAllNumbers: boolean; // Must use all numbers?
  useEachOnce: boolean; // Can only use each number once?
}

/**
 * A solution to a target challenge
 */
export interface TargetSolution {
  expression: string;
  result: number;
  numbersUsed: number[];
  isExact: boolean;
}

// =============================================================================
// Expression Equation Types
// =============================================================================

/**
 * An equation with left and right sides
 */
export interface Equation {
  left: ExpressionNode;
  right: ExpressionNode;
}

/**
 * Result of checking an equation
 */
export interface EquationResult {
  isTrue: boolean;
  leftValue: number;
  rightValue: number;
  error?: string;
}

// =============================================================================
// Game-Specific Types
// =============================================================================

/**
 * Orion-style game: Build expressions to reach target values
 */
export interface OrionGame {
  availableNumbers: ExpressionCard[];
  availableOperators: ExpressionCard[];
  targetValue: number;
  currentExpression: ExpressionSlot[];
  score: number;
}

/**
 * Camel-style game: Complete equations with missing values
 */
export interface CamelGame {
  equation: ExpressionSlot[]; // Full equation with some slots empty
  availableCards: ExpressionCard[];
  correctAnswer?: number;
}

// =============================================================================
// Factory Functions
// =============================================================================

/**
 * Create a number card
 */
export function createNumberCard(value: number, id?: string): ExpressionCard {
  return {
    id: id ?? `num-${value}-${Math.random().toString(36).slice(2, 6)}`,
    content: value.toString(),
    tokenType: 'number',
    value,
  };
}

/**
 * Create an operator card
 */
export function createOperatorCard(operator: Operator, id?: string): ExpressionCard {
  return {
    id: id ?? `op-${operator}-${Math.random().toString(36).slice(2, 6)}`,
    content: operator,
    tokenType: 'operator',
    operator,
  };
}

/**
 * Create a parenthesis card
 */
export function createParenCard(isLeft: boolean, id?: string): ExpressionCard {
  return {
    id: id ?? `paren-${isLeft ? 'l' : 'r'}-${Math.random().toString(36).slice(2, 6)}`,
    content: isLeft ? '(' : ')',
    tokenType: isLeft ? 'lparen' : 'rparen',
  };
}

/**
 * Create an empty expression slot
 */
export function createSlot(index: number, card?: ExpressionCard, locked?: boolean): ExpressionSlot {
  return {
    id: `slot-${index}`,
    index,
    card: card ?? null,
    locked,
  };
}

/**
 * Create a set of number cards (1-9)
 */
export function createBasicNumberCards(): ExpressionCard[] {
  return [1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => createNumberCard(n));
}

/**
 * Create a set of basic operator cards
 */
export function createBasicOperatorCards(): ExpressionCard[] {
  const operators: Operator[] = ['+', '-', '*', '/'];
  return operators.map((op) => createOperatorCard(op));
}

/**
 * Create a full deck of expression cards
 */
export function createExpressionDeck(options?: {
  numbers?: number[];
  operators?: Operator[];
  includeParens?: boolean;
}): ExpressionCard[] {
  const numbers = options?.numbers ?? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const operators = options?.operators ?? ['+', '-', '*', '/'];
  const includeParens = options?.includeParens ?? true;

  const cards: ExpressionCard[] = [];

  // Add number cards
  for (const n of numbers) {
    cards.push(createNumberCard(n));
  }

  // Add operator cards
  for (const op of operators) {
    cards.push(createOperatorCard(op));
  }

  // Add parentheses
  if (includeParens) {
    cards.push(createParenCard(true));
    cards.push(createParenCard(false));
  }

  return cards;
}

/**
 * Create a target challenge
 */
export function createTargetChallenge(
  numbers: number[],
  target: number,
  options?: {
    operators?: Operator[];
    useAllNumbers?: boolean;
    useEachOnce?: boolean;
  }
): TargetChallenge {
  return {
    numbers,
    target,
    operators: options?.operators ?? ['+', '-', '*', '/'],
    useAllNumbers: options?.useAllNumbers ?? true,
    useEachOnce: options?.useEachOnce ?? true,
  };
}

// =============================================================================
// Pre-built Challenge Sets
// =============================================================================

/**
 * Easy "make 10" challenges
 */
export const MAKE_TEN_CHALLENGES: TargetChallenge[] = [
  createTargetChallenge([2, 3, 5], 10),
  createTargetChallenge([1, 4, 5], 10),
  createTargetChallenge([2, 2, 6], 10),
  createTargetChallenge([3, 3, 4], 10),
  createTargetChallenge([1, 2, 7], 10),
];

/**
 * Classic "24 game" challenges
 */
export const TWENTY_FOUR_CHALLENGES: TargetChallenge[] = [
  createTargetChallenge([1, 2, 3, 4], 24),
  createTargetChallenge([2, 3, 4, 4], 24),
  createTargetChallenge([1, 3, 4, 6], 24),
  createTargetChallenge([1, 5, 5, 5], 24),
  createTargetChallenge([3, 3, 8, 8], 24),
  createTargetChallenge([2, 5, 5, 10], 24),
  createTargetChallenge([1, 4, 5, 6], 24),
  createTargetChallenge([4, 4, 6, 6], 24),
];

/**
 * Countdown-style challenges with larger numbers
 */
export const COUNTDOWN_CHALLENGES: TargetChallenge[] = [
  createTargetChallenge([25, 50, 75, 100, 3, 6], 952, { useAllNumbers: false }),
  createTargetChallenge([25, 50, 2, 4, 7, 9], 831, { useAllNumbers: false }),
  createTargetChallenge([75, 100, 1, 3, 5, 8], 567, { useAllNumbers: false }),
];
