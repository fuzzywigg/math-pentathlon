// Contig 60 AI Module
// Strategic AI for math expression and placement game
//
// EDUCATIONAL NOTES:
// Contig 60 teaches arithmetic operations, order of operations, and strategic thinking.
// Key skills: Mental math with +, -, *, /; parentheses; maximizing points through positioning.
//
// Strategy tips for learners:
// 1. Look for ALL possible combinations - there might be many numbers you can make!
// 2. Place next to other marked cells to earn more points
// 3. Watch for 5-in-a-row opportunities (yours and opponent's)
// 4. Numbers in the middle of the board can touch more neighbors
// 5. Division only works when it divides evenly - check your math!

import {
  ContigState,
  Player,
  CONFIG,
  getOpponent,
  getAdjacentPositions,
  getValidPlacements,
} from './types';

import {
  doRollDice,
  placeChip,
  passTurn,
  calculatePoints,
  hasValidMoves,
} from './rules';

export type AIDifficulty = 'easy' | 'medium' | 'hard';

const DIFFICULTY_CONFIG = {
  easy: { randomness: 0.5, teachingMode: true, lookahead: false },
  medium: { randomness: 0.15, teachingMode: false, lookahead: false },
  hard: { randomness: 0.03, teachingMode: false, lookahead: true },
};

// =============================================================================
// Position Evaluation
// =============================================================================

/**
 * Count adjacent owned cells in a direction (for 5-in-a-row check)
 */
function countInDirection(
  state: ContigState,
  startValue: number,
  player: Player,
  dr: number,
  dc: number
): number {
  const startCell = state.cells.get(startValue);
  if (!startCell) return 0;

  let count = 0;
  let r = startCell.row + dr;
  let c = startCell.col + dc;

  while (r >= 0 && r < CONFIG.GRID_ROWS && c >= 0 && c < CONFIG.GRID_COLS) {
    const value = state.grid[r][c];
    if (value === null) break;

    const cell = state.cells.get(value);
    if (cell?.owner !== player) break;

    count++;
    r += dr;
    c += dc;
  }

  return count;
}

/**
 * Check if placing at a value creates a 5-in-a-row
 */
function wouldCreateFiveInRow(
  state: ContigState,
  value: number,
  player: Player
): boolean {
  const cell = state.cells.get(value);
  if (!cell) return false;

  const directions = [
    [0, 1],   // Horizontal
    [1, 0],   // Vertical
    [1, 1],   // Diagonal down-right
    [1, -1],  // Diagonal down-left
  ];

  for (const [dr, dc] of directions) {
    // Count in both directions from this position
    const forward = countInDirection(state, value, player, dr, dc);
    const backward = countInDirection(state, value, player, -dr, -dc);

    // Including this cell, total in line is forward + backward + 1
    if (forward + backward + 1 >= CONFIG.WIN_BY_ALIGNMENT) {
      return true;
    }
  }

  return false;
}

/**
 * Check if opponent has a threat (4 in a row that we could block)
 */
function getBlockingMoves(
  state: ContigState,
  validValues: number[],
  opponent: Player
): number[] {
  const blockingMoves: number[] = [];

  for (const value of validValues) {
    // Would placing here block opponent's 5-in-a-row?
    // Check if opponent has 4 adjacent that we could extend
    const cell = state.cells.get(value);
    if (!cell) continue;

    const directions = [
      [0, 1], [1, 0], [1, 1], [1, -1],
    ];

    for (const [dr, dc] of directions) {
      const forward = countInDirection(state, value, opponent, dr, dc);
      const backward = countInDirection(state, value, opponent, -dr, -dc);

      if (forward + backward >= 4) {
        blockingMoves.push(value);
        break;
      }
    }
  }

  return blockingMoves;
}

// =============================================================================
// Move Evaluation
// =============================================================================

interface MoveOption {
  value: number;
  expression: string;
  score: number;
  reasoning: string;
}

/**
 * Evaluate all possible placements
 */
function evaluateMoves(
  state: ContigState,
  aiPlayer: Player,
  _difficulty: AIDifficulty
): MoveOption[] {
  if (!state.currentDice) return [];

  const placements = getValidPlacements(state, state.currentDice);
  if (placements.length === 0) return [];

  const opponent = getOpponent(aiPlayer);
  const validValues = placements.map(p => p.result);
  const blockingMoves = getBlockingMoves(state, validValues, opponent);
  const options: MoveOption[] = [];

  for (const { result, expression } of placements) {
    let score = 0;
    const reasons: string[] = [];
    const cell = state.cells.get(result);
    if (!cell) continue;

    // Factor 1: Win immediately (5 in a row)
    if (wouldCreateFiveInRow(state, result, aiPlayer)) {
      score += 10000;
      reasons.push('Creates 5-in-a-row for the win!');
    }

    // Factor 2: Block opponent's 5-in-a-row
    if (blockingMoves.includes(result)) {
      score += 5000;
      reasons.push('Blocks opponent\'s 5-in-a-row!');
    }

    // Factor 3: Points from adjacency
    const points = calculatePoints(state, result);
    score += points * 100;
    if (points > 0) {
      reasons.push(`Earns ${points} point${points > 1 ? 's' : ''}`);
    }

    // Factor 4: Position value (cells with more potential neighbors)
    const adjacent = getAdjacentPositions(cell.row, cell.col);
    const emptyNeighbors = adjacent.filter(pos => {
      const v = state.grid[pos.row][pos.col];
      return v !== null && state.cells.get(v)?.owner === null;
    }).length;
    score += emptyNeighbors * 10;
    if (emptyNeighbors >= 4) {
      reasons.push('Good position for future points');
    }

    // Factor 5: Building toward 5-in-a-row
    const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];
    let maxChain = 0;
    for (const [dr, dc] of directions) {
      const forward = countInDirection(state, result, aiPlayer, dr, dc);
      const backward = countInDirection(state, result, aiPlayer, -dr, -dc);
      maxChain = Math.max(maxChain, forward + backward);
    }
    if (maxChain >= 2) {
      score += maxChain * 50;
      reasons.push(`Extends chain to ${maxChain + 1}`);
    }

    // Factor 6: Center control (rows 2-3 are more central)
    const centerBonus = Math.max(0, 2 - Math.abs(cell.row - 2.5)) * 5;
    score += centerBonus;

    options.push({
      value: result,
      expression,
      score,
      reasoning: reasons.join('; ') || 'Standard placement',
    });
  }

  // Sort by score
  options.sort((a, b) => b.score - a.score);

  return options;
}

// =============================================================================
// Teaching Mode
// =============================================================================

/**
 * In easy mode, occasionally make suboptimal moves
 */
function getTeachingMove(
  state: ContigState,
  aiPlayer: Player
): MoveOption | null {
  const options = evaluateMoves(state, aiPlayer, 'easy');

  if (options.length === 0) return null;

  // 40% chance to pick a suboptimal move
  if (Math.random() < 0.4 && options.length > 1) {
    // Pick a lower-scoring option
    const suboptimal = options.slice(1);
    if (suboptimal.length > 0) {
      return suboptimal[Math.floor(Math.random() * suboptimal.length)];
    }
  }

  return options[0];
}

// =============================================================================
// Public API
// =============================================================================

export interface AIPlacement {
  value: number;
  expression: string;
  hint?: string;
}

/**
 * Get AI's placement decision
 */
export function getAIPlacement(
  state: ContigState,
  aiPlayer: Player,
  difficulty: AIDifficulty = 'medium'
): AIPlacement | null {
  if (state.phase !== 'calculating') return null;
  if (state.currentPlayer !== aiPlayer) return null;
  if (!state.currentDice) return null;

  const config = DIFFICULTY_CONFIG[difficulty];

  // Check if we have any valid moves
  if (!hasValidMoves(state)) {
    return null; // Will need to pass
  }

  // Teaching mode for easy difficulty
  if (config.teachingMode) {
    const result = getTeachingMove(state, aiPlayer);
    if (result) {
      return { value: result.value, expression: result.expression };
    }
  }

  const options = evaluateMoves(state, aiPlayer, difficulty);

  if (options.length === 0) return null;

  // Add randomness based on difficulty
  if (Math.random() < config.randomness && options.length > 1) {
    const topOptions = options.slice(0, 3);
    const chosen = topOptions[Math.floor(Math.random() * topOptions.length)];
    return { value: chosen.value, expression: chosen.expression };
  }

  return { value: options[0].value, expression: options[0].expression };
}

/**
 * Check if it's the AI's turn
 */
export function isAITurn(
  state: ContigState,
  aiPlayer: Player | null,
  gameMode: 'human-vs-human' | 'human-vs-ai'
): boolean {
  if (gameMode !== 'human-vs-ai') return false;
  if (!aiPlayer) return false;
  if (state.phase === 'gameOver') return false;

  return state.currentPlayer === aiPlayer;
}

/**
 * Execute a complete AI turn (roll + place/pass)
 */
export function executeAITurn(
  state: ContigState,
  aiPlayer: Player,
  difficulty: AIDifficulty = 'medium'
): ContigState {
  let currentState = state;

  // Phase 1: Roll dice
  if (currentState.phase === 'rolling' && currentState.currentPlayer === aiPlayer) {
    currentState = doRollDice(currentState);
  }

  // Phase 2: Place or pass
  if (currentState.phase === 'calculating' && currentState.currentPlayer === aiPlayer) {
    const placement = getAIPlacement(currentState, aiPlayer, difficulty);

    if (placement) {
      currentState = placeChip(currentState, placement.value, placement.expression);
    } else {
      // No valid moves, must pass
      currentState = passTurn(currentState);
    }
  }

  return currentState;
}
