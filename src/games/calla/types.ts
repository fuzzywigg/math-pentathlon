// Calla Game Types
// Mancala-style game where players distribute cubes to capture and earn free turns

export type Player = 'player1' | 'player2';

// Board layout: 5 shields (pits) per side + 1 Calla (store) per player
export const PITS_PER_SIDE = 5;
export const INITIAL_CUBES_PER_PIT = 3;
export const TOTAL_CUBES = PITS_PER_SIDE * 2 * INITIAL_CUBES_PER_PIT;

// Game phases
export type GamePhase = 'selectPit' | 'animating' | 'gameOver';

// A move record for history
export interface MoveRecord {
  player: Player;
  pitIndex: number;
  cubesDistributed: number;
  captured: number;
  gotFreeTurn: boolean;
  moveNumber: number;
}

// Game state
export interface CallaGameState {
  // Player 1's pits (indices 0-4, left to right from P1's view)
  player1Pits: number[];
  // Player 2's pits (indices 0-4, left to right from P2's view)
  player2Pits: number[];
  // Player stores (Callas)
  player1Calla: number;
  player2Calla: number;

  // Current turn
  currentPlayer: Player;
  phase: GamePhase;

  // Animation state
  animatingPit: number | null;
  lastSownPit: { side: 'player1' | 'player2' | 'calla'; index: number } | null;

  // Move history
  moveHistory: MoveRecord[];

  // Winner
  winner: Player | 'tie' | null;
}

// Create initial game state
export function createInitialState(): CallaGameState {
  return {
    player1Pits: Array(PITS_PER_SIDE).fill(INITIAL_CUBES_PER_PIT),
    player2Pits: Array(PITS_PER_SIDE).fill(INITIAL_CUBES_PER_PIT),
    player1Calla: 0,
    player2Calla: 0,
    currentPlayer: 'player1',
    phase: 'selectPit',
    animatingPit: null,
    lastSownPit: null,
    moveHistory: [],
    winner: null,
  };
}

// Get opponent
export function getOpponent(player: Player): Player {
  return player === 'player1' ? 'player2' : 'player1';
}

// Get pits for a player
export function getPlayerPits(state: CallaGameState, player: Player): number[] {
  return player === 'player1' ? state.player1Pits : state.player2Pits;
}

// Get Calla (store) count for a player
export function getPlayerCalla(state: CallaGameState, player: Player): number {
  return player === 'player1' ? state.player1Calla : state.player2Calla;
}

// Check if a side is empty
export function isSideEmpty(state: CallaGameState, player: Player): boolean {
  const pits = getPlayerPits(state, player);
  return pits.every(count => count === 0);
}

// Get total cubes on a side
export function getSideTotalCubes(state: CallaGameState, player: Player): number {
  const pits = getPlayerPits(state, player);
  return pits.reduce((sum, count) => sum + count, 0);
}

// Get opposite pit index (for captures)
// When sowing counter-clockwise, opposite pit for index i is (PITS_PER_SIDE - 1 - i)
export function getOppositePitIndex(pitIndex: number): number {
  return PITS_PER_SIDE - 1 - pitIndex;
}
