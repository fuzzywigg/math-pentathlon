// Ramrod Game Types
// Cuisenaire rods game - addend combinations to complete sum boxes

export type Player = 'player1' | 'player2';

// Cuisenaire rod - each has a specific color and length
export interface Rod {
  id: string;
  length: number; // 1-10 cm
  color: string;
  owner: Player | null; // null = common pool
  position: RodPosition | null;
}

// Position on the board
export interface RodPosition {
  boxId: string;
  slot: number; // 0 or 1 (two rods per box)
}

// A sum box on the board - needs two rods to complete
export interface SumBox {
  id: string;
  targetSum: number; // The sum this box requires (e.g., 7, 8, 9, 10)
  row: number;
  col: number;
  rods: [Rod | null, Rod | null]; // Two slots for rods
  completedBy: Player | null;
}

// A move in the game
export interface RamrodMove {
  player: Player;
  rod: Rod;
  boxId: string;
  slot: number;
  capturedBox: boolean;
  pointsScored: number;
  moveNumber: number;
}

// Game phase
export type GamePhase =
  | 'selectingRod'   // Player selecting a rod
  | 'placingRod'     // Player placing the rod in a box
  | 'gameOver';

// Game state
export interface RamrodState {
  boxes: Map<string, SumBox>;
  rods: Map<string, Rod>;
  playerRods: {
    player1: string[]; // Rod IDs in player's area
    player2: string[];
  };
  currentPlayer: Player;
  selectedRod: string | null;
  phase: GamePhase;
  scores: {
    player1: number; // Total cm captured
    player2: number;
  };
  winner: Player | null;
  moveHistory: RamrodMove[];
}

// Configuration
export const CONFIG = {
  TARGET_SCORE: 24, // 24 cm to win
  BOARD_ROWS: 3,
  BOARD_COLS: 4,
  STARTING_RODS_PER_PLAYER: 5,
};

// Cuisenaire rod colors and lengths
export const ROD_COLORS: Record<number, string> = {
  1: '#ffffff', // White
  2: '#e53935', // Red
  3: '#7cb342', // Light Green
  4: '#8e24aa', // Purple
  5: '#fdd835', // Yellow
  6: '#388e3c', // Dark Green
  7: '#212121', // Black
  8: '#6d4c41', // Brown
  9: '#1976d2', // Blue
  10: '#ff9800', // Orange
};

export const ROD_NAMES: Record<number, string> = {
  1: 'White',
  2: 'Red',
  3: 'Light Green',
  4: 'Purple',
  5: 'Yellow',
  6: 'Dark Green',
  7: 'Black',
  8: 'Brown',
  9: 'Blue',
  10: 'Orange',
};

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Create a rod
 */
export function createRod(id: string, length: number): Rod {
  return {
    id,
    length,
    color: ROD_COLORS[length],
    owner: null,
    position: null,
  };
}

/**
 * Create a standard set of rods for the game
 */
export function createRodSet(): Rod[] {
  const rods: Rod[] = [];
  let id = 0;

  // Create multiple rods of each length (similar to standard Cuisenaire set)
  const counts: Record<number, number> = {
    1: 8,  // White - many small
    2: 6,  // Red
    3: 5,  // Light Green
    4: 4,  // Purple
    5: 4,  // Yellow
    6: 3,  // Dark Green
    7: 3,  // Black
    8: 2,  // Brown
    9: 2,  // Blue
    10: 2, // Orange
  };

  for (let length = 1; length <= 10; length++) {
    for (let i = 0; i < counts[length]; i++) {
      rods.push(createRod(`r${id++}`, length));
    }
  }

  return rods;
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
 * Create box ID
 */
export function createBoxId(row: number, col: number): string {
  return `box-${row}-${col}`;
}
