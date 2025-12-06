// Remainder Islands Game Types
// Division game with hexagonal islands - use remainders to traverse the board

export type Player = 'player1' | 'player2';

// Island values for division
export const ISLAND_VALUES = [2, 3, 4, 5, 6, 7, 8, 9];

// A hexagonal island on the board
export interface Island {
  id: string;
  row: number;
  col: number;
  value: number;  // The divisor value
  owner: Player | null;
  chips: number;  // Number of chips on this island
}

// Dice roll result
export interface DiceRoll {
  die1: number;
  die2: number;
  total: number;
}

// Division result
export interface DivisionResult {
  dividend: number;  // Total from dice
  divisor: number;   // Island value
  quotient: number;
  remainder: number;
}

// Game phases
export type GamePhase =
  | 'rolling'      // Waiting for dice roll
  | 'selectIsland' // Choose which island to land on
  | 'gameOver';

// Game state
export interface RemainderIslandsState {
  islands: Island[];
  currentPlayer: Player;
  phase: GamePhase;

  // Current dice roll
  currentRoll: DiceRoll | null;

  // Valid islands for current roll
  validIslands: string[];  // Island IDs

  // Selected island preview
  selectedIsland: string | null;

  // Scores
  player1Score: number;
  player2Score: number;

  // Chips remaining for each player
  player1Chips: number;
  player2Chips: number;

  // Move history
  moveHistory: MoveRecord[];

  // Winner
  winner: Player | null;

  // Turns remaining
  turnsRemaining: number;
}

// Move record
export interface MoveRecord {
  player: Player;
  roll: DiceRoll;
  island: Island;
  divisionResult: DivisionResult;
  pointsEarned: number;
  turnNumber: number;
}

// Game configuration
export const INITIAL_CHIPS_PER_PLAYER = 12;
export const TOTAL_TURNS = 24;  // 12 turns each player

// Hexagonal grid configuration
export const GRID_ROWS = 5;
export const GRID_COLS = 7;

// Create initial island grid
function createIslands(): Island[] {
  const islands: Island[] = [];
  let valueIndex = 0;

  // Create a hex grid pattern
  for (let row = 0; row < GRID_ROWS; row++) {
    const colOffset = row % 2 === 0 ? 0 : 0.5;
    const colCount = row % 2 === 0 ? GRID_COLS : GRID_COLS - 1;

    for (let col = 0; col < colCount; col++) {
      // Assign values in a pattern (cycling through island values)
      const value = ISLAND_VALUES[valueIndex % ISLAND_VALUES.length];
      valueIndex++;

      islands.push({
        id: `island-${row}-${col}`,
        row,
        col: col + colOffset,
        value,
        owner: null,
        chips: 0,
      });
    }
  }

  return islands;
}

// Create initial game state
export function createInitialState(): RemainderIslandsState {
  return {
    islands: createIslands(),
    currentPlayer: 'player1',
    phase: 'rolling',
    currentRoll: null,
    validIslands: [],
    selectedIsland: null,
    player1Score: 0,
    player2Score: 0,
    player1Chips: INITIAL_CHIPS_PER_PLAYER,
    player2Chips: INITIAL_CHIPS_PER_PLAYER,
    moveHistory: [],
    winner: null,
    turnsRemaining: TOTAL_TURNS,
  };
}

// Get opponent
export function getOpponent(player: Player): Player {
  return player === 'player1' ? 'player2' : 'player1';
}

// Get player chips
export function getPlayerChips(state: RemainderIslandsState, player: Player): number {
  return player === 'player1' ? state.player1Chips : state.player2Chips;
}

// Get player score
export function getPlayerScore(state: RemainderIslandsState, player: Player): number {
  return player === 'player1' ? state.player1Score : state.player2Score;
}
