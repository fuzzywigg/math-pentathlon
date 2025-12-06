// Remainder Islands Game Rules
// Dice rolling, island selection, and scoring

import {
  RemainderIslandsState,
  DiceRoll,
  DivisionResult,
  MoveRecord,
  Player,
  getOpponent,
} from './types';

// =============================================================================
// Dice Rolling
// =============================================================================

/**
 * Roll two dice
 */
export function rollDice(): DiceRoll {
  const die1 = Math.floor(Math.random() * 6) + 1;
  const die2 = Math.floor(Math.random() * 6) + 1;
  return {
    die1,
    die2,
    total: die1 + die2,
  };
}

/**
 * Perform roll and determine valid islands
 */
export function performRoll(state: RemainderIslandsState): RemainderIslandsState {
  if (state.phase !== 'rolling') return state;

  const roll = rollDice();
  const validIslands = findValidIslands(state, roll.total);

  return {
    ...state,
    currentRoll: roll,
    validIslands,
    phase: validIslands.length > 0 ? 'selectIsland' : 'rolling',
    // If no valid islands, automatically skip to next player
    currentPlayer: validIslands.length > 0 ? state.currentPlayer : getOpponent(state.currentPlayer),
    turnsRemaining: validIslands.length > 0 ? state.turnsRemaining : state.turnsRemaining - 1,
  };
}

// =============================================================================
// Island Selection
// =============================================================================

/**
 * Find all valid islands for a given dice total
 * An island is valid if:
 * 1. It's not already owned by the opponent
 * 2. The remainder when dividing total by island value is useful (not 0, or island not owned)
 */
export function findValidIslands(state: RemainderIslandsState, _total: number): string[] {
  const currentPlayer = state.currentPlayer;

  // All islands that aren't owned by opponent are valid
  // Player will score the remainder (_total % island.value) when they select
  return state.islands
    .filter(island => {
      // Can't place on opponent's island
      if (island.owner !== null && island.owner !== currentPlayer) {
        return false;
      }

      // Island is valid - player will score the remainder
      // Even 0 remainder can be strategic to block
      return true;
    })
    .map(island => island.id);
}

/**
 * Calculate division result
 */
export function calculateDivision(dividend: number, divisor: number): DivisionResult {
  return {
    dividend,
    divisor,
    quotient: Math.floor(dividend / divisor),
    remainder: dividend % divisor,
  };
}

/**
 * Select an island and place a chip
 */
export function selectIsland(
  state: RemainderIslandsState,
  islandId: string
): RemainderIslandsState {
  if (state.phase !== 'selectIsland' || !state.currentRoll) return state;
  if (!state.validIslands.includes(islandId)) return state;

  const island = state.islands.find(i => i.id === islandId);
  if (!island) return state;

  const division = calculateDivision(state.currentRoll.total, island.value);
  const currentPlayer = state.currentPlayer;

  // Points earned is the remainder
  const pointsEarned = division.remainder;

  // Update island
  const newIslands = state.islands.map(i => {
    if (i.id !== islandId) return i;
    return {
      ...i,
      owner: currentPlayer,
      chips: i.chips + 1,
    };
  });

  // Update player score and chips
  const newPlayer1Score = currentPlayer === 'player1'
    ? state.player1Score + pointsEarned
    : state.player1Score;
  const newPlayer2Score = currentPlayer === 'player2'
    ? state.player2Score + pointsEarned
    : state.player2Score;

  const newPlayer1Chips = currentPlayer === 'player1'
    ? state.player1Chips - 1
    : state.player1Chips;
  const newPlayer2Chips = currentPlayer === 'player2'
    ? state.player2Chips - 1
    : state.player2Chips;

  // Record move
  const move: MoveRecord = {
    player: currentPlayer,
    roll: state.currentRoll,
    island: { ...island },
    divisionResult: division,
    pointsEarned,
    turnNumber: state.moveHistory.length + 1,
  };

  // Check for game over
  const turnsRemaining = state.turnsRemaining - 1;
  const isGameOver = turnsRemaining <= 0 ||
    (newPlayer1Chips <= 0 && newPlayer2Chips <= 0);

  // Determine winner if game over
  let winner: Player | null = null;
  if (isGameOver) {
    if (newPlayer1Score > newPlayer2Score) winner = 'player1';
    else if (newPlayer2Score > newPlayer1Score) winner = 'player2';
    // Null = draw
  }

  // Next player
  const nextPlayer = getOpponent(currentPlayer);

  return {
    ...state,
    islands: newIslands,
    player1Score: newPlayer1Score,
    player2Score: newPlayer2Score,
    player1Chips: newPlayer1Chips,
    player2Chips: newPlayer2Chips,
    currentPlayer: isGameOver ? currentPlayer : nextPlayer,
    phase: isGameOver ? 'gameOver' : 'rolling',
    currentRoll: null,
    validIslands: [],
    selectedIsland: null,
    moveHistory: [...state.moveHistory, move],
    turnsRemaining,
    winner,
  };
}

/**
 * Set preview selection
 */
export function setSelectedIsland(
  state: RemainderIslandsState,
  islandId: string | null
): RemainderIslandsState {
  return {
    ...state,
    selectedIsland: islandId,
  };
}

// =============================================================================
// Scoring Helpers
// =============================================================================

/**
 * Get preview of division result for an island
 */
export function previewDivision(
  state: RemainderIslandsState,
  islandId: string
): DivisionResult | null {
  if (!state.currentRoll) return null;

  const island = state.islands.find(i => i.id === islandId);
  if (!island) return null;

  return calculateDivision(state.currentRoll.total, island.value);
}

/**
 * Count islands owned by each player
 */
export function countOwnedIslands(state: RemainderIslandsState): { player1: number; player2: number } {
  return state.islands.reduce(
    (acc, island) => {
      if (island.owner === 'player1') acc.player1++;
      else if (island.owner === 'player2') acc.player2++;
      return acc;
    },
    { player1: 0, player2: 0 }
  );
}
