// Attribute Logic - Matching, filtering, and set validation
// Core logic for attribute-based game mechanics

import {
  AttributeValue,
  AttributePiece,
  AttributeDefinition,
  AttributeCondition,
  CompoundCondition,
  ComparisonOperator,
  MatchResult,
  SetRule,
  SetRelationship,
} from './types';

// =============================================================================
// Comparison Operations
// =============================================================================

/**
 * Compare two attribute values using an operator
 */
export function compare(
  left: AttributeValue,
  operator: ComparisonOperator,
  right: AttributeValue
): boolean {
  switch (operator) {
    case 'equals':
      return left === right;

    case 'not_equals':
      return left !== right;

    case 'greater_than':
      return typeof left === 'number' && typeof right === 'number' && left > right;

    case 'less_than':
      return typeof left === 'number' && typeof right === 'number' && left < right;

    case 'greater_equal':
      return typeof left === 'number' && typeof right === 'number' && left >= right;

    case 'less_equal':
      return typeof left === 'number' && typeof right === 'number' && left <= right;

    default:
      return false;
  }
}

/**
 * Evaluate a single attribute condition against a piece
 */
export function evaluateCondition(
  piece: AttributePiece,
  condition: AttributeCondition
): boolean {
  const value = piece.attributes[condition.attribute];
  if (value === undefined) return false;
  return compare(value, condition.operator, condition.value);
}

/**
 * Evaluate a compound condition (with logical operators)
 */
export function evaluateCompound(
  piece: AttributePiece,
  compound: CompoundCondition
): boolean {
  const results = compound.conditions.map((cond) => {
    if ('operator' in cond && 'conditions' in cond) {
      return evaluateCompound(piece, cond as CompoundCondition);
    }
    return evaluateCondition(piece, cond as AttributeCondition);
  });

  switch (compound.operator) {
    case 'and':
      return results.every((r) => r);

    case 'or':
      return results.some((r) => r);

    case 'not':
      return results.length > 0 ? !results[0] : false;

    case 'xor':
      return results.filter((r) => r).length === 1;

    default:
      return false;
  }
}

// =============================================================================
// Piece Matching
// =============================================================================

/**
 * Check if a piece matches a condition (single or compound)
 */
export function matchesPiece(
  piece: AttributePiece,
  condition: AttributeCondition | CompoundCondition
): boolean {
  if ('conditions' in condition) {
    return evaluateCompound(piece, condition);
  }
  return evaluateCondition(piece, condition);
}

/**
 * Get detailed match result for a piece against conditions
 */
export function getMatchDetails(
  piece: AttributePiece,
  conditions: AttributeCondition[]
): MatchResult {
  const matchedAttributes: string[] = [];
  const unmatchedAttributes: string[] = [];

  for (const condition of conditions) {
    if (evaluateCondition(piece, condition)) {
      matchedAttributes.push(condition.attribute);
    } else {
      unmatchedAttributes.push(condition.attribute);
    }
  }

  return {
    matches: unmatchedAttributes.length === 0,
    matchedAttributes,
    unmatchedAttributes,
  };
}

/**
 * Filter pieces by a condition
 */
export function filterPieces(
  pieces: AttributePiece[],
  condition: AttributeCondition | CompoundCondition
): AttributePiece[] {
  return pieces.filter((piece) => matchesPiece(piece, condition));
}

/**
 * Find pieces that share an attribute value with a target piece
 */
export function findMatchingAttribute(
  target: AttributePiece,
  pieces: AttributePiece[],
  attributeName: string
): AttributePiece[] {
  const targetValue = target.attributes[attributeName];
  if (targetValue === undefined) return [];

  return pieces.filter(
    (piece) =>
      piece.id !== target.id && piece.attributes[attributeName] === targetValue
  );
}

/**
 * Count how many attributes match between two pieces
 */
export function countMatchingAttributes(
  piece1: AttributePiece,
  piece2: AttributePiece
): number {
  let count = 0;
  for (const key of Object.keys(piece1.attributes)) {
    if (piece1.attributes[key] === piece2.attributes[key]) {
      count++;
    }
  }
  return count;
}

/**
 * Get list of attributes that match between two pieces
 */
export function getMatchingAttributes(
  piece1: AttributePiece,
  piece2: AttributePiece
): string[] {
  const matching: string[] = [];
  for (const key of Object.keys(piece1.attributes)) {
    if (piece1.attributes[key] === piece2.attributes[key]) {
      matching.push(key);
    }
  }
  return matching;
}

/**
 * Get list of attributes that differ between two pieces
 */
export function getDifferingAttributes(
  piece1: AttributePiece,
  piece2: AttributePiece
): string[] {
  const differing: string[] = [];
  for (const key of Object.keys(piece1.attributes)) {
    if (piece1.attributes[key] !== piece2.attributes[key]) {
      differing.push(key);
    }
  }
  return differing;
}

// =============================================================================
// Set Validation (for SET-like games)
// =============================================================================

/**
 * Check if a set of pieces satisfies a relationship for an attribute
 */
export function checkSetRelationship(
  pieces: AttributePiece[],
  attribute: string,
  relationship: SetRelationship
): boolean {
  if (pieces.length === 0) return true;

  const values = pieces.map((p) => p.attributes[attribute]);

  switch (relationship) {
    case 'all_same':
      return values.every((v) => v === values[0]);

    case 'all_different':
      const uniqueValues = new Set(values);
      return uniqueValues.size === values.length;

    case 'any':
      return true;

    default:
      return false;
  }
}

/**
 * Check if a set of pieces is valid according to rules
 */
export function isValidSet(pieces: AttributePiece[], rules: SetRule[]): boolean {
  return rules.every((rule) =>
    checkSetRelationship(pieces, rule.attribute, rule.relationship)
  );
}

/**
 * Standard SET game validation (all same or all different for each attribute)
 */
export function isValidSetGameSet(
  pieces: AttributePiece[],
  attributes: AttributeDefinition[]
): boolean {
  if (pieces.length !== 3) return false;

  for (const attr of attributes) {
    const values = pieces.map((p) => p.attributes[attr.name]);
    const allSame = values.every((v) => v === values[0]);
    const allDifferent = new Set(values).size === 3;

    if (!allSame && !allDifferent) {
      return false;
    }
  }

  return true;
}

/**
 * Find all valid sets from a collection of pieces
 */
export function findAllValidSets(
  pieces: AttributePiece[],
  rules: SetRule[],
  setSize: number = 3
): AttributePiece[][] {
  const validSets: AttributePiece[][] = [];

  function findSets(
    start: number,
    current: AttributePiece[]
  ): void {
    if (current.length === setSize) {
      if (isValidSet(current, rules)) {
        validSets.push([...current]);
      }
      return;
    }

    for (let i = start; i < pieces.length; i++) {
      current.push(pieces[i]);
      findSets(i + 1, current);
      current.pop();
    }
  }

  findSets(0, []);
  return validSets;
}

// =============================================================================
// Math Properties (for Matheracy-style games)
// =============================================================================

/**
 * Check if a number is prime
 */
export function isPrime(n: number): boolean {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  for (let i = 3; i <= Math.sqrt(n); i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}

/**
 * Check if a number is a perfect square
 */
export function isPerfectSquare(n: number): boolean {
  if (n < 0) return false;
  const sqrt = Math.sqrt(n);
  return sqrt === Math.floor(sqrt);
}

/**
 * Get the digit sum of a number
 */
export function getDigitSum(n: number): number {
  return Math.abs(n)
    .toString()
    .split('')
    .reduce((sum, digit) => sum + parseInt(digit, 10), 0);
}

/**
 * Get all factors of a number
 */
export function getFactors(n: number): number[] {
  const factors: number[] = [];
  const absN = Math.abs(n);
  for (let i = 1; i <= absN; i++) {
    if (absN % i === 0) {
      factors.push(i);
    }
  }
  return factors;
}

/**
 * Check if two numbers are coprime (GCD = 1)
 */
export function areCoprime(a: number, b: number): boolean {
  function gcd(x: number, y: number): number {
    return y === 0 ? x : gcd(y, x % y);
  }
  return gcd(Math.abs(a), Math.abs(b)) === 1;
}

/**
 * Generate a piece with computed math properties
 */
export function createMathPiece(n: number): AttributePiece {
  return {
    id: `num-${n}`,
    attributes: {
      number: n,
      isPrime: isPrime(n),
      isSquare: isPerfectSquare(n),
      digitSum: getDigitSum(n),
      isEven: n % 2 === 0,
      divisibleBy3: n % 3 === 0,
      divisibleBy5: n % 5 === 0,
      factorCount: getFactors(n).length,
    },
  };
}

// =============================================================================
// Grouping and Analysis
// =============================================================================

/**
 * Group pieces by an attribute value
 */
export function groupByAttribute(
  pieces: AttributePiece[],
  attribute: string
): Map<AttributeValue, AttributePiece[]> {
  const groups = new Map<AttributeValue, AttributePiece[]>();

  for (const piece of pieces) {
    const value = piece.attributes[attribute];
    if (!groups.has(value)) {
      groups.set(value, []);
    }
    groups.get(value)!.push(piece);
  }

  return groups;
}

/**
 * Get unique values for an attribute from pieces
 */
export function getUniqueValues(
  pieces: AttributePiece[],
  attribute: string
): AttributeValue[] {
  const values = new Set<AttributeValue>();
  for (const piece of pieces) {
    values.add(piece.attributes[attribute]);
  }
  return Array.from(values);
}

/**
 * Sort pieces by an attribute (numeric or string)
 */
export function sortByAttribute(
  pieces: AttributePiece[],
  attribute: string,
  descending: boolean = false
): AttributePiece[] {
  return [...pieces].sort((a, b) => {
    const valA = a.attributes[attribute];
    const valB = b.attributes[attribute];

    let comparison = 0;
    if (typeof valA === 'number' && typeof valB === 'number') {
      comparison = valA - valB;
    } else {
      comparison = String(valA).localeCompare(String(valB));
    }

    return descending ? -comparison : comparison;
  });
}
