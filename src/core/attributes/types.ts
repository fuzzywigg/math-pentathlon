// Attribute Logic Types - Structures for attribute-based games
// Used by: Some-Sum, Matheracy (logic puzzles with multiple properties)

/** An attribute value (can be string, number, or boolean) */
export type AttributeValue = string | number | boolean;

/** An attribute definition */
export interface AttributeDefinition {
  name: string;
  possibleValues: AttributeValue[];
  displayName?: string;
  colorMap?: Record<string, string>;
}

/** A piece/card with multiple attributes */
export interface AttributePiece {
  id: string;
  attributes: Record<string, AttributeValue>;
}

/** Attribute comparison operators */
export type ComparisonOperator =
  | 'equals'
  | 'not_equals'
  | 'greater_than'
  | 'less_than'
  | 'greater_equal'
  | 'less_equal';

/** Logical operators for combining conditions */
export type LogicalOperator = 'and' | 'or' | 'not' | 'xor';

/** A single attribute condition */
export interface AttributeCondition {
  attribute: string;
  operator: ComparisonOperator;
  value: AttributeValue;
}

/** A compound condition (combining multiple conditions) */
export interface CompoundCondition {
  operator: LogicalOperator;
  conditions: (AttributeCondition | CompoundCondition)[];
}

/** Match result with details */
export interface MatchResult {
  matches: boolean;
  matchedAttributes: string[];
  unmatchedAttributes: string[];
}

/** Set relationship between pieces */
export type SetRelationship =
  | 'all_same'      // All pieces have same value for attribute
  | 'all_different' // All pieces have different values for attribute
  | 'any';          // No constraint

/** A rule for valid sets (like in SET card game) */
export interface SetRule {
  attribute: string;
  relationship: SetRelationship;
}

/** Configuration for attribute rendering */
export interface AttributeRenderConfig {
  pieceSize: number;
  showLabels: boolean;
  labelPosition: 'inside' | 'below' | 'tooltip';
  shape: 'card' | 'circle' | 'square' | 'custom';
}

// =============================================================================
// Pre-built Attribute Sets for Math Pentathlon Games
// =============================================================================

/** Some-Sum game attributes (numbers with properties) */
export const SOME_SUM_ATTRIBUTES: AttributeDefinition[] = [
  {
    name: 'value',
    displayName: 'Value',
    possibleValues: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  },
  {
    name: 'parity',
    displayName: 'Parity',
    possibleValues: ['odd', 'even'],
    colorMap: { odd: '#2196f3', even: '#f44336' },
  },
  {
    name: 'size',
    displayName: 'Size',
    possibleValues: ['small', 'medium', 'large'],
    colorMap: { small: '#4caf50', medium: '#ff9800', large: '#9c27b0' },
  },
];

/** Classic SET game attributes */
export const SET_GAME_ATTRIBUTES: AttributeDefinition[] = [
  {
    name: 'number',
    displayName: 'Count',
    possibleValues: [1, 2, 3],
  },
  {
    name: 'shape',
    displayName: 'Shape',
    possibleValues: ['diamond', 'oval', 'squiggle'],
    colorMap: { diamond: '#e91e63', oval: '#2196f3', squiggle: '#4caf50' },
  },
  {
    name: 'shading',
    displayName: 'Shading',
    possibleValues: ['solid', 'striped', 'empty'],
  },
  {
    name: 'color',
    displayName: 'Color',
    possibleValues: ['red', 'green', 'purple'],
    colorMap: { red: '#f44336', green: '#4caf50', purple: '#9c27b0' },
  },
];

/** Matheracy game attributes (math properties) */
export const MATHERACY_ATTRIBUTES: AttributeDefinition[] = [
  {
    name: 'number',
    displayName: 'Number',
    possibleValues: Array.from({ length: 100 }, (_, i) => i + 1),
  },
  {
    name: 'isPrime',
    displayName: 'Prime',
    possibleValues: [true, false],
  },
  {
    name: 'isSquare',
    displayName: 'Perfect Square',
    possibleValues: [true, false],
  },
  {
    name: 'digitSum',
    displayName: 'Digit Sum',
    possibleValues: Array.from({ length: 18 }, (_, i) => i + 1),
  },
  {
    name: 'divisibleBy3',
    displayName: 'Divisible by 3',
    possibleValues: [true, false],
  },
];

/** Shape-color-size attributes (common pattern) */
export const BASIC_ATTRIBUTES: AttributeDefinition[] = [
  {
    name: 'shape',
    displayName: 'Shape',
    possibleValues: ['circle', 'square', 'triangle'],
    colorMap: { circle: '#2196f3', square: '#f44336', triangle: '#4caf50' },
  },
  {
    name: 'color',
    displayName: 'Color',
    possibleValues: ['red', 'blue', 'yellow'],
    colorMap: { red: '#f44336', blue: '#2196f3', yellow: '#ffeb3b' },
  },
  {
    name: 'size',
    displayName: 'Size',
    possibleValues: ['small', 'medium', 'large'],
  },
];

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Generate all possible pieces from attribute definitions
 */
export function generateAllPieces(attributes: AttributeDefinition[]): AttributePiece[] {
  const pieces: AttributePiece[] = [];

  function generate(index: number, current: Record<string, AttributeValue>): void {
    if (index === attributes.length) {
      const id = Object.entries(current)
        .map(([k, v]) => `${k}:${v}`)
        .join('|');
      pieces.push({ id, attributes: { ...current } });
      return;
    }

    const attr = attributes[index];
    for (const value of attr.possibleValues) {
      current[attr.name] = value;
      generate(index + 1, current);
    }
  }

  generate(0, {});
  return pieces;
}

/**
 * Get the color for an attribute value
 */
export function getAttributeColor(
  attributes: AttributeDefinition[],
  attrName: string,
  value: AttributeValue
): string | undefined {
  const attr = attributes.find(a => a.name === attrName);
  return attr?.colorMap?.[String(value)];
}

/**
 * Create a piece with specified attributes
 */
export function createPiece(
  id: string,
  attrs: Record<string, AttributeValue>
): AttributePiece {
  return { id, attributes: attrs };
}
