// Contig 60 Game Rules
// Game logic for rolling, placing, and scoring

import {
  ContigState,
  Player,
  ContigMove,
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
    const adjValue = state.grid[row][col];
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

  // Check for winner
  const winner = checkWinner(newState);
  if (winner) {
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

  // Check if player is eliminated
  if (newConsecutivePasses[state.currentPlayer] >= CONFIG.MAX_CONSECUTIVE_PASSES) {
    // Current player loses
    return {
      ...state,
      consecutivePasses: newConsecutivePasses,
      winner: getOpponent(state.currentPlayer),
      phase: 'gameOver',
    };
  }

  return {
    ...state,
    consecutivePasses: newConsecutivePasses,
    currentPlayer: getOpponent(state.currentPlayer),
    currentDice: null,
    currentExpression: null,
    phase: 'rolling',
  };
}

// =============================================================================
// Win Detection
// =============================================================================

/**
 * Check for 5 in a row (optional win condition)
 */
function checkFiveInRow(state: ContigState, player: Player): boolean {
  const grid = state.grid;
  const rows = CONFIG.GRID_ROWS;
  const cols = CONFIG.GRID_COLS;

  // Check all directions from each cell
  const directions = [
    [0, 1],   // Horizontal
    [1, 0],   // Vertical
    [1, 1],   // Diagonal down-right
    [1, -1],  // Diagonal down-left
  ];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const startValue = grid[row][col];
      if (startValue === null) continue;

      const startCell = state.cells.get(startValue);
      if (startCell?.owner !== player) continue;

      for (const [dr, dc] of directions) {
        let count = 1;

        // Count in positive direction
        let r = row + dr;
        let c = col + dc;
        while (r >= 0 && r < rows && c >= 0 && c < cols) {
          const v = grid[r][c];
          if (v === null) break;
          const cell = state.cells.get(v);
          if (cell?.owner !== player) break;
          count++;
          r += dr;
          c += dc;
        }

        if (count >= CONFIG.WIN_BY_ALIGNMENT) {
          return true;
        }
      }
    }
  }

  return false;
}

/**
 * Check for a winner
 */
export function checkWinner(state: ContigState): Player | null {
  // Check 5 in a row
  if (checkFiveInRow(state, 'player1')) return 'player1';
  if (checkFiveInRow(state, 'player2')) return 'player2';

  // Check if board is full
  let allMarked = true;
  for (const cell of state.cells.values()) {
    if (cell.owner === null) {
      allMarked = false;
      break;
    }
  }

  if (allMarked) {
    // Winner by points
    if (state.scores.player1 > state.scores.player2) return 'player1';
    if (state.scores.player2 > state.scores.player1) return 'player2';
    // Tie - continue (or could be a draw)
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
