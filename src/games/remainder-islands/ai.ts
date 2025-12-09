// Remainder Islands AI Module
// Strategic AI for division-based island conquest game
//
// EDUCATIONAL NOTES:
// Remainder Islands teaches division with remainders.
// Key skills: Division facts, calculating remainders, strategic thinking.
//
// Strategy tips for learners:
// 1. Remainder = dividend % divisor (what's left after division)
// 2. Example: 11 ÷ 4 = 2 remainder 3, so 11 % 4 = 3
// 3. Larger remainders = more points! Pick islands that maximize remainder
// 4. If dice total = 8, picking island 3 gives remainder 2, island 5 gives 3
// 5. Also consider territory - owning islands blocks opponent
// 6. Low dice rolls work well with high island values (9 % 8 = 1)

import {
  RemainderIslandsState,
  Player,
} from './types';
import {
  selectIsland,
  calculateDivision,
} from './rules';

export type AIDifficulty = 'easy' | 'medium' | 'hard';

const DIFFICULTY_CONFIG = {
  easy: { randomness: 0.5, teachingMode: true },
  medium: { randomness: 0.15, teachingMode: false },
  hard: { randomness: 0.03, teachingMode: false },
};

// =============================================================================
// Move Evaluation
// =============================================================================

interface MoveOption {
  islandId: string;
  score: number;
  remainder: number;
  reasoning: string;
}

/**
 * Evaluate all valid island choices
 */
function evaluateMoves(
  state: RemainderIslandsState,
  player: Player,
  _difficulty: AIDifficulty
): MoveOption[] {
  if (!state.currentRoll) return [];

  const diceTotal = state.currentRoll.total;
  const moves: MoveOption[] = [];

  for (const islandId of state.validIslands) {
    const island = state.islands.find(i => i.id === islandId);
    if (!island) continue;

    const division = calculateDivision(diceTotal, island.value);
    const remainder = division.remainder;
    const reasons: string[] = [];

    let score = remainder * 10; // Base score from points

    // Factor 1: Points are paramount
    if (remainder >= 4) {
      score += 20;
      reasons.push(`High remainder (${remainder})`);
    } else if (remainder === 0) {
      score -= 5;
      reasons.push('Zero remainder');
    }

    // Factor 2: Territory control - claiming unowned islands
    if (island.owner === null) {
      score += 8;
      reasons.push('Claiming new island');
    } else if (island.owner === player) {
      // Adding more chips to our island
      score += 3;
      reasons.push('Reinforcing our island');
    }

    // Factor 3: Blocking potential - islands in central areas
    // (In hex grid, middle rows are more valuable)
    if (island.row >= 1 && island.row <= 3) {
      score += 5;
      reasons.push('Central position');
    }

    // Factor 4: Consider island value for future rolls
    // Lower divisors (2, 3) are more likely to give remainders on average
    if (island.value <= 4) {
      score += 3;
      reasons.push('Flexible island');
    }

    moves.push({
      islandId,
      score,
      remainder,
      reasoning: reasons.join('; ') || 'Standard move',
    });
  }

  moves.sort((a, b) => b.score - a.score);
  return moves;
}

// =============================================================================
// Teaching Mode
// =============================================================================

/**
 * In easy mode, sometimes pick lower-scoring islands
 */
function getTeachingMove(
  state: RemainderIslandsState,
  player: Player
): MoveOption | null {
  const moves = evaluateMoves(state, player, 'easy');

  if (moves.length === 0) return null;

  // 40% chance to pick a lower-scoring move
  if (Math.random() < 0.4 && moves.length > 1) {
    const suboptimal = moves.slice(1, Math.min(4, moves.length));
    if (suboptimal.length > 0) {
      return suboptimal[Math.floor(Math.random() * suboptimal.length)];
    }
  }

  return moves[0];
}

// =============================================================================
// Public API
// =============================================================================

export interface AIIslandChoice {
  islandId: string;
  hint?: string;
}

/**
 * Get AI's island selection
 */
export function getAIIslandChoice(
  state: RemainderIslandsState,
  aiPlayer: Player,
  difficulty: AIDifficulty = 'medium'
): AIIslandChoice | null {
  if (state.phase !== 'selectIsland') return null;
  if (state.currentPlayer !== aiPlayer) return null;
  if (!state.currentRoll) return null;

  const config = DIFFICULTY_CONFIG[difficulty];

  // Teaching mode
  if (config.teachingMode) {
    const result = getTeachingMove(state, aiPlayer);
    if (result) {
      return { islandId: result.islandId };
    }
  }

  const moves = evaluateMoves(state, aiPlayer, difficulty);

  if (moves.length === 0) return null;

  // Add randomness based on difficulty
  if (Math.random() < config.randomness && moves.length > 1) {
    const topMoves = moves.slice(0, 3);
    const chosen = topMoves[Math.floor(Math.random() * topMoves.length)];
    return { islandId: chosen.islandId };
  }

  return { islandId: moves[0].islandId };
}

/**
 * Check if it's the AI's turn to select
 */
export function isAITurn(
  state: RemainderIslandsState,
  aiPlayer: Player | null
): boolean {
  if (!aiPlayer) return false;
  if (state.phase === 'gameOver') return false;
  return state.currentPlayer === aiPlayer;
}

/**
 * Execute AI island selection
 */
export function executeAISelection(
  state: RemainderIslandsState,
  aiPlayer: Player,
  difficulty: AIDifficulty = 'medium'
): RemainderIslandsState {
  const choice = getAIIslandChoice(state, aiPlayer, difficulty);

  if (!choice) return state;

  return selectIsland(state, choice.islandId);
}
