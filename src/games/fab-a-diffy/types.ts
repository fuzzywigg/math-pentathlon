// Fab-a-Diffy Game Types
// Fraction bars game - combine two fractions with operations to match answer bars

import { Fraction, FractionOperation } from '../../core/fractions/types';

export type Player = 'player1' | 'player2';

// A fraction bar piece that players can use
export interface FractionBar {
  id: string;
  fraction: Fraction;
  owner: Player | null; // null = available in pool
  used: boolean;
}

// An answer bar on the game board
export interface AnswerBar {
  id: string;
  fraction: Fraction;
  claimedBy: Player | null;
}

// A move combining two fractions
export interface FabMove {
  player: Player;
  bar1Id: string;
  bar2Id: string;
  operation: FractionOperation;
  resultId: string;
  moveNumber: number;
}

// Game phase
export type GamePhase =
  | 'selectingBar1'    // Choose first fraction bar
  | 'selectingBar2'    // Choose second fraction bar
  | 'selectingOperation' // Choose operation (+, -, ×, ÷)
  | 'confirmingMove'   // Confirm the move
  | 'gameOver';

// Game state
export interface FabADiffyState {
  fractionBars: Map<string, FractionBar>; // Available fraction bars
  answerBars: Map<string, AnswerBar>;     // Target answers on board
  currentPlayer: Player;
  selectedBar1: string | null;
  selectedBar2: string | null;
  selectedOperation: FractionOperation | null;
  phase: GamePhase;
  winner: Player | null;
  moveHistory: FabMove[];
  scores: { player1: number; player2: number };
}

// Configuration
export const CONFIG = {
  // Standard game uses specific fraction values
  TOTAL_ROUNDS: 10, // Number of turns before game ends
};

// =============================================================================
// Fraction Bars - The pieces players choose from
// =============================================================================

// The standard set of fraction bars used in the game
// Values based on Math Pentathlon Fab-a-Diffy with denominators 2-12
export const FRACTION_BAR_VALUES: Fraction[] = [
  // Halves
  { numerator: 1, denominator: 2 },

  // Thirds
  { numerator: 1, denominator: 3 },
  { numerator: 2, denominator: 3 },

  // Quarters
  { numerator: 1, denominator: 4 },
  { numerator: 2, denominator: 4 },
  { numerator: 3, denominator: 4 },

  // Fifths
  { numerator: 1, denominator: 5 },
  { numerator: 2, denominator: 5 },
  { numerator: 3, denominator: 5 },
  { numerator: 4, denominator: 5 },

  // Sixths
  { numerator: 1, denominator: 6 },
  { numerator: 2, denominator: 6 },
  { numerator: 3, denominator: 6 },
  { numerator: 4, denominator: 6 },
  { numerator: 5, denominator: 6 },

  // Eighths
  { numerator: 1, denominator: 8 },
  { numerator: 2, denominator: 8 },
  { numerator: 3, denominator: 8 },
  { numerator: 4, denominator: 8 },
  { numerator: 5, denominator: 8 },
  { numerator: 6, denominator: 8 },
  { numerator: 7, denominator: 8 },

  // Tenths
  { numerator: 1, denominator: 10 },
  { numerator: 2, denominator: 10 },
  { numerator: 3, denominator: 10 },
  { numerator: 4, denominator: 10 },
  { numerator: 5, denominator: 10 },
  { numerator: 6, denominator: 10 },
  { numerator: 7, denominator: 10 },
  { numerator: 8, denominator: 10 },
  { numerator: 9, denominator: 10 },

  // Twelfths
  { numerator: 1, denominator: 12 },
  { numerator: 2, denominator: 12 },
  { numerator: 3, denominator: 12 },
  { numerator: 4, denominator: 12 },
  { numerator: 5, denominator: 12 },
  { numerator: 6, denominator: 12 },
  { numerator: 7, denominator: 12 },
  { numerator: 8, denominator: 12 },
  { numerator: 9, denominator: 12 },
  { numerator: 10, denominator: 12 },
  { numerator: 11, denominator: 12 },
];

// Answer bar values - the targets players try to match
// These are common results from combining the fraction bars above
export const ANSWER_BAR_VALUES: Fraction[] = [
  // Simple fractions
  { numerator: 1, denominator: 2 },
  { numerator: 1, denominator: 3 },
  { numerator: 2, denominator: 3 },
  { numerator: 1, denominator: 4 },
  { numerator: 3, denominator: 4 },
  { numerator: 1, denominator: 6 },
  { numerator: 5, denominator: 6 },

  // Common sums/differences
  { numerator: 1, denominator: 12 },
  { numerator: 5, denominator: 12 },
  { numerator: 7, denominator: 12 },
  { numerator: 11, denominator: 12 },

  // Whole numbers (as fractions)
  { numerator: 1, denominator: 1 },
  { numerator: 0, denominator: 1 },

  // Products
  { numerator: 1, denominator: 8 },
  { numerator: 3, denominator: 8 },
  { numerator: 5, denominator: 8 },
  { numerator: 7, denominator: 8 },

  // More complex results
  { numerator: 1, denominator: 5 },
  { numerator: 2, denominator: 5 },
  { numerator: 3, denominator: 5 },
  { numerator: 4, denominator: 5 },
];

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Create a unique bar ID
 */
export function createBarId(index: number): string {
  return `bar-${index}`;
}

/**
 * Create an answer bar ID
 */
export function createAnswerId(index: number): string {
  return `answer-${index}`;
}

/**
 * Get opponent
 */
export function getOpponent(player: Player): Player {
  return player === 'player1' ? 'player2' : 'player1';
}

/**
 * Shuffle array
 */
export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
