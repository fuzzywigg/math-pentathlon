// Juggle Game Types
// Polyomino placement game with dice selection

import { PolyominoShape, TETROMINOES, PENTOMINOES, SIMPLE_SHAPES } from '../../core/polyomino/types';
import { Board } from '../../core/polyomino/placement';

export type Player = 'player1' | 'player2';

// Define the 5 shape categories for Juggle
export type ShapeCategory = 'monomino' | 'domino' | 'tromino' | 'tetromino' | 'pentomino';

// Map dice values to shape categories
export const DICE_TO_CATEGORY: Record<number, ShapeCategory> = {
  1: 'monomino',
  2: 'domino',
  3: 'tromino',
  4: 'tetromino',
  5: 'pentomino',
  6: 'pentomino', // 6 also gives pentomino (highest value)
};

// Shape pools for each category
export const SHAPE_POOLS: Record<ShapeCategory, PolyominoShape[]> = {
  monomino: SIMPLE_SHAPES.filter(s => s.size === 1),
  domino: SIMPLE_SHAPES.filter(s => s.size === 2),
  tromino: SIMPLE_SHAPES.filter(s => s.size === 3),
  tetromino: TETROMINOES,
  pentomino: PENTOMINOES,
};

// All shapes combined for lookup
export const ALL_SHAPES: PolyominoShape[] = [
  ...SIMPLE_SHAPES,
  ...TETROMINOES,
  ...PENTOMINOES,
];

// Game state
export interface JuggleState {
  boards: { player1: Board; player2: Board };
  currentPlayer: Player;
  currentDice: [number, number] | null;
  selectedCategory: ShapeCategory | null;
  selectedShape: PolyominoShape | null;
  selectedRotation: 0 | 90 | 180 | 270;
  selectedFlipped: boolean;
  hoverPosition: { row: number; col: number } | null;
  winner: Player | null;
  moveHistory: JuggleMove[];
  phase: 'rolling' | 'selectingShape' | 'placing' | 'gameOver';
}

// A move in the game
export interface JuggleMove {
  player: Player;
  dice: [number, number];
  chosenDie: number;
  shapeId: string;
  position: { row: number; col: number };
  rotation: 0 | 90 | 180 | 270;
  flipped: boolean;
  moveNumber: number;
}

// Configuration
export const CONFIG = {
  GRID_SIZE: 9,  // 9x9 grid
  CELLS_TO_FILL: 81, // Total cells (9x9)
};

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Get opponent
 */
export function getOpponent(player: Player): Player {
  return player === 'player1' ? 'player2' : 'player1';
}

/**
 * Roll two dice
 */
export function rollDice(): [number, number] {
  return [
    Math.floor(Math.random() * 6) + 1,
    Math.floor(Math.random() * 6) + 1,
  ];
}

/**
 * Get category from dice value
 */
export function getCategoryFromDie(value: number): ShapeCategory {
  return DICE_TO_CATEGORY[value] || 'monomino';
}

/**
 * Get shapes available for a dice value
 */
export function getShapesForDie(value: number): PolyominoShape[] {
  const category = getCategoryFromDie(value);
  return SHAPE_POOLS[category];
}

/**
 * Get shape by ID
 */
export function getShapeById(id: string): PolyominoShape | undefined {
  return ALL_SHAPES.find(s => s.id === id);
}

/**
 * Get category name for display
 */
export function getCategoryName(category: ShapeCategory): string {
  const names: Record<ShapeCategory, string> = {
    monomino: 'Monomino (1 cell)',
    domino: 'Domino (2 cells)',
    tromino: 'Tromino (3 cells)',
    tetromino: 'Tetromino (4 cells)',
    pentomino: 'Pentomino (5 cells)',
  };
  return names[category];
}
