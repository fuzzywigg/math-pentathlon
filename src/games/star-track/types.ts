// Star Track Game Types
// Players race across a star-shaped track by selecting chain links

export type Player = 'player1' | 'player2';

// Chain link lengths available in the bucket (1-6 units)
export type ChainLength = 1 | 2 | 3 | 4 | 5 | 6;

// A chain link drawn from the bucket
export interface ChainLink {
  length: ChainLength;
  id: number; // Unique identifier
}

// The star track has points and paths between them
// The board is a 5-pointed star with players racing from opposite points to the center
export interface StarTrackPosition {
  // Position on the track (0 = start, increasing toward goal)
  // Each player has their own track
  space: number;
}

// Game phases
export type GamePhase =
  | 'drawChains'      // Player draws two chains from bucket
  | 'selectChain'     // Player chooses which chain to use
  | 'moving'          // Animating movement (optional)
  | 'gameOver';       // Someone reached the goal

// Game state
export interface StarTrackGameState {
  currentPlayer: Player;
  phase: GamePhase;

  // Player positions (0 = start, TRACK_LENGTH = goal/center)
  player1Position: number;
  player2Position: number;

  // The two chains drawn this turn
  drawnChains: [ChainLink, ChainLink] | null;

  // Selected chain for this turn
  selectedChain: ChainLink | null;

  // Winner (if game over)
  winner: Player | null;

  // Move history for display
  moveHistory: StarTrackMove[];

  // Chain bucket (chains available to draw)
  chainBucket: ChainLink[];
}

// A recorded move
export interface StarTrackMove {
  player: Player;
  chainUsed: ChainLength;
  fromPosition: number;
  toPosition: number;
  moveNumber: number;
}

// Track configuration
export const TRACK_LENGTH = 12; // Spaces to reach the center
export const CHAINS_PER_LENGTH = 4; // 4 chains of each length (1-6) = 24 total

// Create the initial chain bucket
export function createChainBucket(): ChainLink[] {
  const bucket: ChainLink[] = [];
  let id = 0;

  for (let length = 1; length <= 6; length++) {
    for (let i = 0; i < CHAINS_PER_LENGTH; i++) {
      bucket.push({
        length: length as ChainLength,
        id: id++,
      });
    }
  }

  // Shuffle the bucket
  return shuffleArray(bucket);
}

// Fisher-Yates shuffle
function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Create initial game state
export function createInitialState(): StarTrackGameState {
  return {
    currentPlayer: 'player1',
    phase: 'drawChains',
    player1Position: 0,
    player2Position: 0,
    drawnChains: null,
    selectedChain: null,
    winner: null,
    moveHistory: [],
    chainBucket: createChainBucket(),
  };
}

// Get opponent player
export function getOpponent(player: Player): Player {
  return player === 'player1' ? 'player2' : 'player1';
}

// Get player's current position
export function getPlayerPosition(state: StarTrackGameState, player: Player): number {
  return player === 'player1' ? state.player1Position : state.player2Position;
}
