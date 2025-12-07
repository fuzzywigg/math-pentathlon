// Kwatro-Sinko Game Types
// Alignment game with numbered chips on pathways

export type Player = 'player1' | 'player2';

// A chip with a numeric value
export interface Chip {
  id: string;
  value: number;
  owner: Player;
  position: string | null; // Node ID or null if not placed
}

// A node on the game board
export interface BoardNode {
  id: string;
  x: number;
  y: number;
  isNumbered: boolean; // Start positions are numbered
  chip: Chip | null;
  connections: string[]; // IDs of connected nodes
}

// A winning alignment
export interface Alignment {
  nodes: string[];
  chips: Chip[];
  expression: string; // e.g., "4 + 3 - 2 = 5"
  result: number; // 4 or 5
}

// A move in the game
export interface KwaMove {
  player: Player;
  chip: Chip;
  fromNode: string;
  toNode: string;
  alignment: Alignment | null;
  moveNumber: number;
}

// Game phase
export type GamePhase =
  | 'selectingChip'  // Player selecting which chip to move
  | 'selectingDest'  // Player selecting destination
  | 'gameOver';

// Game state
export interface KwaState {
  nodes: Map<string, BoardNode>;
  chips: Map<string, Chip>;
  currentPlayer: Player;
  selectedChip: string | null;
  phase: GamePhase;
  winner: Player | null;
  winningAlignment: Alignment | null;
  moveHistory: KwaMove[];
}

// Configuration
export const CONFIG = {
  CHIPS_PER_PLAYER: 5,
  TARGET_VALUES: [4, 5] as const, // Winning alignment values
};

// Player chip values
export const PLAYER_CHIPS = {
  player1: [0, 2, 4, 6, 8], // Even numbers
  player2: [1, 3, 5, 7, 9], // Odd numbers
};

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Get opponent
 */
export function getOpponent(player: Player): Player {
  return player === 'player1' ? 'player2' : 'player1';
}

/**
 * Create a chip
 */
export function createChip(id: string, value: number, owner: Player): Chip {
  return {
    id,
    value,
    owner,
    position: null,
  };
}

/**
 * Check if a sum/difference equals 4 or 5
 */
export function isWinningValue(value: number): boolean {
  return CONFIG.TARGET_VALUES.includes(value as 4 | 5);
}
