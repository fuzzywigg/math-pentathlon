// Sum Dominoes & Dice Game Types
// Match domino faces to dice sums on the board

export type Player = 'player1' | 'player2';

// A domino tile with two faces
export interface Domino {
  id: string;
  face1: number;
  face2: number;
  owner: Player | null; // null = in draw pile
  orientation: 'horizontal' | 'vertical';
}

// Position on the board
export interface BoardPosition {
  row: number;
  col: number;
}

// A placed domino on the board
export interface PlacedDomino {
  domino: Domino;
  position: BoardPosition;
  orientation: 'horizontal' | 'vertical';
}

// A move in the game
export interface SDMove {
  player: Player;
  domino: Domino;
  position: BoardPosition;
  orientation: 'horizontal' | 'vertical';
  matchedFace: number; // The face value that matched the sum
  adjacentFace: number; // The face value it connected to
  diceSum: number;
  moveNumber: number;
}

// Game phase
export type GamePhase =
  | 'rolling'       // Player needs to roll dice
  | 'placing'       // Player selecting where to place domino
  | 'passing'       // Player cannot play, must pass
  | 'gameOver';

// Game state
export interface SumDominoesState {
  board: (PlacedDomino | null)[][]; // 11x11 board
  hands: {
    player1: Domino[];
    player2: Domino[];
  };
  currentPlayer: Player;
  currentDice: [number, number] | null;
  selectedDomino: string | null;
  phase: GamePhase;
  winner: Player | null;
  moveHistory: SDMove[];
  passCount: number; // Consecutive passes
}

// Configuration
export const CONFIG = {
  BOARD_SIZE: 11,       // 11x11 board
  MAX_FACE_VALUE: 6,    // Standard double-six dominoes
  STARTING_HAND_SIZE: 7,
  CENTER_ROW: 5,
  CENTER_COL: 5,
};

// =============================================================================
// Domino Set Creation
// =============================================================================

/**
 * Create a standard double-six domino set (28 tiles)
 */
export function createDominoSet(): Domino[] {
  const dominoes: Domino[] = [];
  let id = 0;

  for (let i = 0; i <= CONFIG.MAX_FACE_VALUE; i++) {
    for (let j = i; j <= CONFIG.MAX_FACE_VALUE; j++) {
      dominoes.push({
        id: `d${id++}`,
        face1: i,
        face2: j,
        owner: null,
        orientation: 'horizontal',
      });
    }
  }

  return dominoes;
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
 * Get total pip count of a domino
 */
export function getDominoPips(domino: Domino): number {
  return domino.face1 + domino.face2;
}

/**
 * Check if domino is a double
 */
export function isDouble(domino: Domino): boolean {
  return domino.face1 === domino.face2;
}

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
  const die1 = Math.floor(Math.random() * 6) + 1;
  const die2 = Math.floor(Math.random() * 6) + 1;
  return [die1, die2];
}

/**
 * Get dice sum
 */
export function getDiceSum(dice: [number, number]): number {
  return dice[0] + dice[1];
}
