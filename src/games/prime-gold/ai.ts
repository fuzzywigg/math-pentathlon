// Prime Gold AI Module
// Strategic AI for prime number spiral game
//
// EDUCATIONAL NOTES:
// Prime Gold teaches prime numbers, factorials, exponents, and expression building.
// Key skills: Recognizing primes, using factorial (!), understanding exponents,
// creating expressions to reach target numbers.
//
// Strategy tips for learners:
// 1. Primes are the key: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47
// 2. Factorials help: 3! = 6, 4! = 24, 5! = 120 (too big for board)
// 3. Build diagonal chains of primes - that's how you win!
// 4. Look for expressions: (a + b) × c, a × b - c, a^b, etc.
// 5. Block opponent's prime veins when you can

import {
  PrimeGoldState,
  Player,
  CONFIG,
} from './types';
import {
  rollDice,
  placeChip,
  getValidPlacements,
  hasValidMoves,
  passTurn,
  findCellByValue,
} from './rules';

export type AIDifficulty = 'easy' | 'medium' | 'hard';

const DIFFICULTY_CONFIG = {
  easy: { randomness: 0.5, teachingMode: true },
  medium: { randomness: 0.15, teachingMode: false },
  hard: { randomness: 0.03, teachingMode: false },
};

// =============================================================================
// Strategic Analysis
// =============================================================================

/**
 * Check if a cell is part of an existing diagonal
 */
function getDiagonalNeighborCount(
  state: PrimeGoldState,
  row: number,
  col: number,
  player: Player
): number {
  const diagonals = [
    [row - 1, col - 1], [row - 1, col + 1],
    [row + 1, col - 1], [row + 1, col + 1],
  ];

  let count = 0;
  for (const [r, c] of diagonals) {
    const neighbor = state.cells.get(`${r},${c}`);
    if (neighbor && neighbor.owner === player && neighbor.isPrime) {
      count++;
    }
  }
  return count;
}

/**
 * Check if placing would extend a diagonal vein
 */
function wouldExtendVein(
  state: PrimeGoldState,
  row: number,
  col: number,
  player: Player
): boolean {
  // Check both diagonal directions
  const directions = [
    [[-1, -1], [1, 1]],  // top-left to bottom-right
    [[-1, 1], [1, -1]],  // top-right to bottom-left
  ];

  for (const [[dr1, dc1], [dr2, dc2]] of directions) {
    let count = 1; // Include this cell

    // Count in first direction
    let r = row + dr1;
    let c = col + dc1;
    while (r >= 0 && r < CONFIG.BOARD_SIZE && c >= 0 && c < CONFIG.BOARD_SIZE) {
      const cell = state.cells.get(`${r},${c}`);
      if (cell && cell.owner === player && cell.isPrime) {
        count++;
        r += dr1;
        c += dc1;
      } else {
        break;
      }
    }

    // Count in second direction
    r = row + dr2;
    c = col + dc2;
    while (r >= 0 && r < CONFIG.BOARD_SIZE && c >= 0 && c < CONFIG.BOARD_SIZE) {
      const cell = state.cells.get(`${r},${c}`);
      if (cell && cell.owner === player && cell.isPrime) {
        count++;
        r += dr2;
        c += dc2;
      } else {
        break;
      }
    }

    if (count >= 3) return true; // Would be part of a 3+ chain
  }

  return false;
}

/**
 * Check if placing would block opponent's vein
 */
function wouldBlockOpponentVein(
  state: PrimeGoldState,
  row: number,
  col: number,
  opponent: Player
): boolean {
  return wouldExtendVein(state, row, col, opponent);
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
function evaluatePlacements(
  state: PrimeGoldState,
  player: Player,
  _difficulty: AIDifficulty
): MoveOption[] {
  const placements = getValidPlacements(state);
  const moves: MoveOption[] = [];
  const opponent: Player = player === 'player1' ? 'player2' : 'player1';

  for (const { value, expr } of placements) {
    const cell = findCellByValue(state, value);
    if (!cell) continue;

    let score = 0;
    const reasons: string[] = [];

    // Factor 1: Prime cells are valuable (the key to winning)
    if (cell.isPrime) {
      score += 100;
      reasons.push('Prime number');
    }

    // Factor 2: Would extend our diagonal vein
    if (cell.isPrime && wouldExtendVein(state, cell.row, cell.col, player)) {
      score += 200;
      reasons.push('Extends prime vein');
    }

    // Factor 3: Adjacent to our other primes
    const neighborCount = getDiagonalNeighborCount(state, cell.row, cell.col, player);
    if (neighborCount > 0 && cell.isPrime) {
      score += neighborCount * 50;
      reasons.push(`Near ${neighborCount} owned prime(s)`);
    }

    // Factor 4: Block opponent's vein
    if (cell.isPrime && wouldBlockOpponentVein(state, cell.row, cell.col, opponent)) {
      score += 150;
      reasons.push('Blocks opponent vein');
    }

    // Factor 5: Center control
    const center = Math.floor(CONFIG.BOARD_SIZE / 2);
    const dist = Math.abs(cell.row - center) + Math.abs(cell.col - center);
    score += (CONFIG.BOARD_SIZE - dist) * 5;

    // Factor 6: Goldbach target cells (bonus)
    if (cell.isGoldbachTarget) {
      score += 10;
      reasons.push('Goldbach number');
    }

    moves.push({
      value,
      expression: expr,
      score,
      reasoning: reasons.join('; ') || 'Standard placement',
    });
  }

  moves.sort((a, b) => b.score - a.score);
  return moves;
}

// =============================================================================
// Teaching Mode
// =============================================================================

/**
 * In easy mode, occasionally make suboptimal moves
 */
function getTeachingPlacement(
  state: PrimeGoldState,
  player: Player
): MoveOption | null {
  const moves = evaluatePlacements(state, player, 'easy');

  if (moves.length === 0) return null;

  // 40% chance to pick a non-prime or lower-scoring move
  if (Math.random() < 0.4 && moves.length > 1) {
    const suboptimal = moves.filter(m => {
      const cell = findCellByValue(state, m.value);
      return cell && !cell.isPrime;
    });
    if (suboptimal.length > 0) {
      return suboptimal[Math.floor(Math.random() * suboptimal.length)];
    }
    // Otherwise just pick lower scoring
    const bottomHalf = moves.slice(Math.floor(moves.length / 2));
    if (bottomHalf.length > 0) {
      return bottomHalf[Math.floor(Math.random() * bottomHalf.length)];
    }
  }

  return moves[0];
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
  state: PrimeGoldState,
  aiPlayer: Player,
  difficulty: AIDifficulty = 'medium'
): AIPlacement | null {
  if (state.phase !== 'placing') return null;
  if (state.currentPlayer !== aiPlayer) return null;

  // Check if we have any valid moves
  if (!hasValidMoves(state)) {
    return null; // Will need to pass
  }

  const config = DIFFICULTY_CONFIG[difficulty];

  // Teaching mode for easy difficulty
  if (config.teachingMode) {
    const result = getTeachingPlacement(state, aiPlayer);
    if (result) {
      return { value: result.value, expression: result.expression };
    }
  }

  const moves = evaluatePlacements(state, aiPlayer, difficulty);

  if (moves.length === 0) return null;

  // Add randomness based on difficulty
  if (Math.random() < config.randomness && moves.length > 1) {
    const topMoves = moves.slice(0, 3);
    const chosen = topMoves[Math.floor(Math.random() * topMoves.length)];
    return { value: chosen.value, expression: chosen.expression };
  }

  return { value: moves[0].value, expression: moves[0].expression };
}

/**
 * Check if it's the AI's turn
 */
export function isAITurn(
  state: PrimeGoldState,
  aiPlayer: Player | null,
  gameMode: 'human-vs-human' | 'human-vs-ai'
): boolean {
  if (gameMode !== 'human-vs-ai') return false;
  if (!aiPlayer) return false;
  if (state.phase === 'gameOver') return false;

  return state.currentPlayer === aiPlayer;
}

/**
 * Execute a complete AI turn (roll + place)
 */
export function executeAITurn(
  state: PrimeGoldState,
  aiPlayer: Player,
  difficulty: AIDifficulty = 'medium'
): PrimeGoldState {
  let currentState = state;

  // Roll dice if needed
  if (currentState.phase === 'rolling') {
    currentState = rollDice(currentState);
  }

  // Place chip
  if (currentState.phase === 'placing') {
    const placement = getAIPlacement(currentState, aiPlayer, difficulty);

    if (placement) {
      currentState = placeChip(currentState, placement.value, placement.expression);
    } else {
      currentState = passTurn(currentState);
    }
  }

  return currentState;
}
