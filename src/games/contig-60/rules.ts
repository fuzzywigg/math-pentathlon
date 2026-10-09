// Contig 60 Game Rules
// Game logic for rolling, placing, and scoring

import type { ContigState, Player, ContigWinner, ContigMove } from './types';
import {
  CONFIG,
  getOpponent,
  getAdjacentPositions,
  rollDice,
  getValidPlacements,
} from './types';

// =============================================================================
// Dice Rolling
// =============================================================================

/**
 * Roll dice and transition to calculating phase
 */
export function doRollDice(state: ContigState): ContigState {
  if (state.phase !== 'rolling') return state;

  const dice = rollDice();
  const validPlacements = getValidPlacements(state, dice);

  return {
    ...state,
    currentDice: dice,
    phase: validPlacements.length > 0 ? 'calculating' : 'calculating', // Stay in calculating even if no moves
  };
}

// =============================================================================
// Placement
// =============================================================================

/**
 * Calculate points for placing on a cell
 */
export function calculatePoints(state: ContigState, value: number): number {
  const cell = state.cells.get(value);
  if (!cell) return 0;

  let points = 0;
  const adjacent = getAdjacentPositions(cell.row, cell.col);

  for (const { row, col } of adjacent) {
    // ratchet: getAdjacentPositions only yields in-bounds dense-grid coords.
    const adjValue = state.grid[row]![col]!;
    if (adjValue !== null) {
      const adjCell = state.cells.get(adjValue);
      if (adjCell?.owner !== null) {
        points += 1;
      }
    }
  }

  return points;
}

/**
 * Place a chip on a cell
 */
export function placeChip(
  state: ContigState,
  value: number,
  expression: string
): ContigState {
  if (state.phase !== 'calculating' || !state.currentDice) return state;

  const cell = state.cells.get(value);
  if (!cell || cell.owner !== null) return state;

  // Calculate points before placing
  const points = calculatePoints(state, value);

  // Clone cells
  const newCells = new Map(state.cells);
  newCells.set(value, { ...cell, owner: state.currentPlayer });

  // Update scores
  const newScores = {
    ...state.scores,
    [state.currentPlayer]: state.scores[state.currentPlayer] + points,
  };

  // Reset consecutive passes
  const newConsecutivePasses = {
    ...state.consecutivePasses,
    [state.currentPlayer]: 0,
  };

  // Record move
  const move: ContigMove = {
    player: state.currentPlayer,
    dice: state.currentDice,
    expression,
    result: value,
    points,
    moveNumber: state.moveHistory.length + 1,
  };

  let newState: ContigState = {
    ...state,
    cells: newCells,
    scores: newScores,
    consecutivePasses: newConsecutivePasses,
    currentPlayer: getOpponent(state.currentPlayer),
    currentDice: null,
    currentExpression: null,
    moveHistory: [...state.moveHistory, move],
    phase: 'rolling',
  };

  const winner = checkWinner(newState);
  if (winner !== null) {
    newState = { ...newState, winner, phase: 'gameOver' };
  }

  return newState;
}

/**
 * Pass turn (when no valid moves available)
 */
export function passTurn(state: ContigState): ContigState {
  if (state.phase !== 'calculating') return state;

  const newConsecutivePasses = {
    ...state.consecutivePasses,
    [state.currentPlayer]: state.consecutivePasses[state.currentPlayer] + 1,
  };

  const nextState: ContigState = {
    ...state,
    consecutivePasses: newConsecutivePasses,
    currentPlayer: getOpponent(state.currentPlayer),
    currentDice: null,
    currentExpression: null,
    phase: 'rolling',
  };

  const bothPassedInARow =
    newConsecutivePasses.player1 > 0 && newConsecutivePasses.player2 > 0;
  const winner = checkWinner(nextState, { settle: bothPassedInARow });
  if (winner !== null) {
    return { ...nextState, winner, phase: 'gameOver' };
  }

  return nextState;
}

// =============================================================================
// Win Detection
// =============================================================================

const ALIGNMENT_DIRECTIONS: ReadonlyArray<readonly [number, number]> = [
  [0, 1], // Horizontal
  [1, 0], // Vertical
  [1, 1], // Diagonal down-right
  [1, -1], // Diagonal down-left
];

function ownerAt(state: ContigState, row: number, col: number): Player | null {
  if (
    row < 0 ||
    row >= CONFIG.GRID_ROWS ||
    col < 0 ||
    col >= CONFIG.GRID_COLS
  ) {
    return null;
  }
  // ratchet: ownerAt bounds-checks row/col against CONFIG before indexing.
  const value = state.grid[row]![col]!;
  if (value === null) return null;
  return state.cells.get(value)?.owner ?? null;
}

/**
 * Count n-in-a-row lines (sliding windows of exactly `length`).
 */
export function countNInARows(
  state: ContigState,
  player: Player,
  length: number
): number {
  let count = 0;
  const rows = CONFIG.GRID_ROWS;
  const cols = CONFIG.GRID_COLS;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (ownerAt(state, row, col) !== player) continue;

      for (const [dr, dc] of ALIGNMENT_DIRECTIONS) {
        let complete = true;
        for (let k = 1; k < length; k++) {
          if (ownerAt(state, row + dr * k, col + dc * k) !== player) {
            complete = false;
            break;
          }
        }
        if (complete) count++;
      }
    }
  }

  return count;
}

function checkFiveInRow(state: ContigState, player: Player): boolean {
  return countNInARows(state, player, CONFIG.WIN_BY_ALIGNMENT) > 0;
}

export function isBoardFull(state: ContigState): boolean {
  for (const cell of state.cells.values()) {
    if (cell.owner === null) return false;
  }
  return true;
}

/**
 * Official tiebreak: most 4-in-a-rows, then most 3-in-a-rows, else draw.
 */
export function alignmentTiebreak(state: ContigState): ContigWinner {
  const four1 = countNInARows(state, 'player1', CONFIG.TIEBREAK_FOUR);
  const four2 = countNInARows(state, 'player2', CONFIG.TIEBREAK_FOUR);
  if (four1 !== four2) return four1 > four2 ? 'player1' : 'player2';

  const three1 = countNInARows(state, 'player1', CONFIG.TIEBREAK_THREE);
  const three2 = countNInARows(state, 'player2', CONFIG.TIEBREAK_THREE);
  if (three1 !== three2) return three1 > three2 ? 'player1' : 'player2';

  return 'draw';
}

/**
 * Check for a winner. 5-in-a-row wins immediately. Full board (or
 * `settle` after both players passed in a row) uses the alignment tiebreak.
 */
export function checkWinner(
  state: ContigState,
  options?: { settle?: boolean }
): ContigWinner | null {
  if (checkFiveInRow(state, 'player1')) return 'player1';
  if (checkFiveInRow(state, 'player2')) return 'player2';

  if (isBoardFull(state) || options?.settle) {
    return alignmentTiebreak(state);
  }

  return null;
}

/**
 * Check if current player can make any valid moves with their dice
 */
export function hasValidMoves(state: ContigState): boolean {
  if (!state.currentDice) return false;
  const placements = getValidPlacements(state, state.currentDice);
  return placements.length > 0;
}
