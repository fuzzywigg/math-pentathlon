// Par 55 Game Types
// Attribute blocks placed on pentagon bases, scoring by matching attributes

export type Player = 'player1' | 'player2';

// The four attributes of each block
export type Shape = 'circle' | 'square' | 'triangle' | 'rectangle' | 'hexagon';
export type BlockColor = 'red' | 'blue' | 'yellow';
export type Size = 'small' | 'large';
export type Thickness = 'thin' | 'thick';

// An attribute block
export interface AttributeBlock {
  id: string;
  shape: Shape;
  color: BlockColor;
  size: Size;
  thickness: Thickness;
}

// A base on the board (pentagon shaped, connected to others)
export interface Base {
  id: string;
  row: number;
  col: number;
  block: AttributeBlock | null;
  placedBy: Player | null;
  adjacentBases: string[]; // IDs of connected bases
}

// A move in the game
export interface Par55Move {
  player: Player;
  block: AttributeBlock;
  baseId: string;
  pointsScored: number;
  matchDetails: MatchDetail[];
  moveNumber: number;
}

// Details about a single adjacency match
export interface MatchDetail {
  adjacentBaseId: string;
  matchingAttributes: string[];
  points: number;
}

// Game phase
export type GamePhase =
  | 'selectingBlock' // Player selecting a block from their hand
  | 'placingBlock'   // Player placing the block on a base
  | 'gameOver';

// Game state
export interface Par55State {
  bases: Map<string, Base>;
  hands: {
    player1: AttributeBlock[];
    player2: AttributeBlock[];
  };
  currentPlayer: Player;
  selectedBlock: string | null;
  phase: GamePhase;
  scores: {
    player1: number;
    player2: number;
  };
  winner: Player | null;
  moveHistory: Par55Move[];
  lastMoveBaseId: string | null;
}

// Configuration
export const CONFIG = {
  TARGET_SCORE: 55,
  HAND_SIZE: 5,
  BOARD_ROWS: 5,
  BOARD_COLS: 7,
};

// All possible attribute values
export const SHAPES: Shape[] = ['circle', 'square', 'triangle', 'rectangle', 'hexagon'];
export const COLORS: BlockColor[] = ['red', 'blue', 'yellow'];
export const SIZES: Size[] = ['small', 'large'];
export const THICKNESSES: Thickness[] = ['thin', 'thick'];

// =============================================================================
// Block Set Creation
// =============================================================================

/**
 * Create all possible attribute blocks (5 × 3 × 2 × 2 = 60 blocks)
 */
export function createBlockSet(): AttributeBlock[] {
  const blocks: AttributeBlock[] = [];
  let id = 0;

  for (const shape of SHAPES) {
    for (const color of COLORS) {
      for (const size of SIZES) {
        for (const thickness of THICKNESSES) {
          blocks.push({
            id: `b${id++}`,
            shape,
            color,
            size,
            thickness,
          });
        }
      }
    }
  }

  return blocks;
}

/**
 * Shuffle an array
 */
export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Get opponent
 */
export function getOpponent(player: Player): Player {
  return player === 'player1' ? 'player2' : 'player1';
}

/**
 * Count matching attributes between two blocks
 */
export function countMatchingAttributes(block1: AttributeBlock, block2: AttributeBlock): string[] {
  const matches: string[] = [];

  if (block1.shape === block2.shape) matches.push('shape');
  if (block1.color === block2.color) matches.push('color');
  if (block1.size === block2.size) matches.push('size');
  if (block1.thickness === block2.thickness) matches.push('thickness');

  return matches;
}

/**
 * Create unique base ID
 */
export function createBaseId(row: number, col: number): string {
  return `base-${row}-${col}`;
}
