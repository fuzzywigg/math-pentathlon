// Par 55 AI Module
// Strategic AI for attribute matching game
//
// EDUCATIONAL NOTES:
// Par 55 teaches attribute recognition and logical thinking.
// Key skills: Identifying matching properties, maximizing scoring opportunities,
// understanding how attributes relate across multiple pieces.
//
// Strategy tips for learners:
// 1. Look for spots where you can match multiple attributes at once
// 2. Large blocks touch more neighbors = more potential points
// 3. Try to match 3-4 attributes with adjacent blocks for big scores
// 4. Position blocks where they can score from multiple directions
// 5. Watch what attributes are already on the board to find the best matches

import {
  Par55State,
  AttributeBlock,
  Player,
  CONFIG,
} from './types';
import {
  selectBlock,
  placeBlock,
  getValidPlacements,
  hasValidMoves,
  calculateScore,
  passTurn,
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
 * Evaluate future potential of a position
 */
function evaluatePositionPotential(
  state: Par55State,
  baseId: string,
  _block: AttributeBlock
): number {
  const base = state.bases.get(baseId);
  if (!base) return 0;

  let potential = 0;

  // Count empty adjacent bases (future expansion potential)
  let emptyNeighbors = 0;
  for (const adjId of base.adjacentBases) {
    const adjBase = state.bases.get(adjId);
    if (adjBase && !adjBase.block) {
      emptyNeighbors++;
    }
  }
  potential += emptyNeighbors * 2; // More empty neighbors = more future opportunities

  // Evaluate connectivity - being in a central position is valuable
  if (base.row >= 1 && base.row <= CONFIG.BOARD_ROWS - 2) {
    potential += 5; // Not on edge rows
  }
  if (base.col >= 1 && base.col <= CONFIG.BOARD_COLS - 2) {
    potential += 5; // Not on edge columns
  }

  return potential;
}

// =============================================================================
// Move Evaluation
// =============================================================================

interface MoveOption {
  blockId: string;
  baseId: string;
  immediateScore: number;
  potentialScore: number;
  totalScore: number;
  reasoning: string;
}

/**
 * Evaluate all possible moves
 */
function evaluateMoves(
  state: Par55State,
  player: Player,
  _difficulty: AIDifficulty
): MoveOption[] {
  const hand = state.hands[player];
  const validBases = getValidPlacements(state);
  const moves: MoveOption[] = [];

  if (hand.length === 0 || validBases.length === 0) return moves;

  for (const block of hand) {
    for (const baseId of validBases) {
      const { totalPoints, matchDetails } = calculateScore(state, block, baseId);
      const potentialScore = evaluatePositionPotential(state, baseId, block);

      let score = totalPoints * 100; // Immediate points are important
      score += potentialScore * 10;  // Future potential matters too

      const reasons: string[] = [];

      // Factor 1: High immediate score
      if (totalPoints >= 4) {
        score += 50;
        reasons.push(`Scores ${totalPoints} points!`);
      } else if (totalPoints >= 2) {
        reasons.push(`Scores ${totalPoints} points`);
      }

      // Factor 2: Multi-attribute matches (educational value)
      const maxMatch = Math.max(...matchDetails.map(m => m.matchingAttributes.length), 0);
      if (maxMatch >= 3) {
        score += 30;
        reasons.push(`${maxMatch}-attribute match`);
      }

      // Factor 3: Strategic position
      if (potentialScore > 10) {
        score += 20;
        reasons.push('Good strategic position');
      }

      // Factor 4: Progress toward winning
      const newScore = state.scores[player] + totalPoints;
      if (newScore >= CONFIG.TARGET_SCORE) {
        score += 10000; // Winning move!
        reasons.push('Winning move!');
      } else if (newScore >= CONFIG.TARGET_SCORE - 10) {
        score += 50;
        reasons.push('Approaching victory');
      }

      moves.push({
        blockId: block.id,
        baseId,
        immediateScore: totalPoints,
        potentialScore,
        totalScore: score,
        reasoning: reasons.join('; ') || 'Standard placement',
      });
    }
  }

  moves.sort((a, b) => b.totalScore - a.totalScore);
  return moves;
}

// =============================================================================
// Teaching Mode
// =============================================================================

/**
 * In easy mode, occasionally make suboptimal moves
 */
function getTeachingMove(
  state: Par55State,
  player: Player
): MoveOption | null {
  const moves = evaluateMoves(state, player, 'easy');

  if (moves.length === 0) return null;

  // 40% chance to pick a lower-scoring move
  if (Math.random() < 0.4 && moves.length > 1) {
    // Pick a move that scores fewer points (but not 0)
    const suboptimal = moves.filter(m =>
      m.immediateScore < moves[0].immediateScore &&
      m.immediateScore > 0
    );
    if (suboptimal.length > 0) {
      return suboptimal[Math.floor(Math.random() * suboptimal.length)];
    }

    // Otherwise pick from bottom half
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

export interface AIMove {
  blockId: string;
  baseId: string;
  hint?: string;
}

/**
 * Get AI's move decision
 */
export function getAIMove(
  state: Par55State,
  aiPlayer: Player,
  difficulty: AIDifficulty = 'medium'
): AIMove | null {
  if (state.phase === 'gameOver') return null;
  if (state.currentPlayer !== aiPlayer) return null;

  // Check if we have any valid moves
  if (!hasValidMoves(state)) {
    return null; // Will need to pass
  }

  const config = DIFFICULTY_CONFIG[difficulty];

  // Teaching mode for easy difficulty
  if (config.teachingMode) {
    const result = getTeachingMove(state, aiPlayer);
    if (result) {
      return { blockId: result.blockId, baseId: result.baseId };
    }
  }

  const moves = evaluateMoves(state, aiPlayer, difficulty);

  if (moves.length === 0) return null;

  // Add randomness based on difficulty
  if (Math.random() < config.randomness && moves.length > 1) {
    const topMoves = moves.slice(0, 3);
    const chosen = topMoves[Math.floor(Math.random() * topMoves.length)];
    return { blockId: chosen.blockId, baseId: chosen.baseId };
  }

  return { blockId: moves[0].blockId, baseId: moves[0].baseId };
}

/**
 * Check if it's the AI's turn
 */
export function isAITurn(
  state: Par55State,
  aiPlayer: Player | null,
  gameMode: 'human-vs-human' | 'human-vs-ai'
): boolean {
  if (gameMode !== 'human-vs-ai') return false;
  if (!aiPlayer) return false;
  if (state.phase === 'gameOver') return false;

  return state.currentPlayer === aiPlayer;
}

/**
 * Execute a complete AI turn
 */
export function executeAITurn(
  state: Par55State,
  aiPlayer: Player,
  difficulty: AIDifficulty = 'medium'
): Par55State {
  const move = getAIMove(state, aiPlayer, difficulty);

  if (!move) {
    // No valid moves, pass
    return passTurn(state);
  }

  // Execute the move
  let currentState = state;
  currentState = selectBlock(currentState, move.blockId);
  currentState = placeBlock(currentState, move.baseId);

  return currentState;
}
