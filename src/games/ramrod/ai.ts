// Ramrod AI Module
// Strategic AI for Cuisenaire rod addition game
//
// EDUCATIONAL NOTES:
// Ramrod teaches addition facts and number bonds using Cuisenaire rods.
// Key skills: Addition facts to 10, addend pairs, strategic placement.
//
// Strategy tips for learners:
// 1. Learn your number bonds: 5=1+4=2+3, 6=1+5=2+4=3+3, etc.
// 2. Complete boxes to score points - partial placement gives you nothing!
// 3. Watch what rods your opponent has - can you block their completions?
// 4. Higher value boxes (9, 10) give more points but are harder to complete
// 5. Sometimes it's better to wait for the right rod than place randomly

import {
  RamrodState,
  Player,
  CONFIG,
} from './types';
import {
  selectRod,
  placeRod,
  getValidPlacements,
  hasValidMoves,
  passTurn,
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
  rodId: string;
  boxId: string;
  slot: number;
  score: number;
  reasoning: string;
  completesBox: boolean;
}

/**
 * Evaluate all possible moves
 */
function evaluateMoves(
  state: RamrodState,
  player: Player,
  _difficulty: AIDifficulty
): MoveOption[] {
  const playerRods = state.playerRods[player];
  const moves: MoveOption[] = [];
  const opponent: Player = player === 'player1' ? 'player2' : 'player1';

  for (const rodId of playerRods) {
    const rod = state.rods.get(rodId);
    if (!rod) continue;

    const placements = getValidPlacements(state, rodId);

    for (const { boxId, slot } of placements) {
      const box = state.boxes.get(boxId);
      if (!box) continue;

      let score = 0;
      const reasons: string[] = [];
      let completesBox = false;

      // Check if this would complete the box
      const otherSlot = slot === 0 ? 1 : 0;
      const otherRod = box.rods[otherSlot];

      if (otherRod && otherRod.length + rod.length === box.targetSum) {
        completesBox = true;
        score += box.targetSum * 100; // Base score for completing
        reasons.push(`Completes box for ${box.targetSum}cm`);

        // Extra bonus for higher value boxes
        if (box.targetSum >= 9) {
          score += 50;
          reasons.push('High value capture');
        }

        // Check if this would win the game
        const newScore = state.scores[player] + box.targetSum;
        if (newScore >= CONFIG.TARGET_SCORE) {
          score += 10000;
          reasons.push('Winning move!');
        }
      } else if (otherRod) {
        // Can't complete - check if opponent could complete with a rod they have
        const needed = box.targetSum - rod.length;
        const opponentRodIds = state.playerRods[opponent];
        const opponentHasNeeded = opponentRodIds.some(id => {
          const r = state.rods.get(id);
          return r && r.length === needed;
        });

        if (opponentHasNeeded) {
          // We'd be setting up opponent!
          score -= 50;
          reasons.push('Might help opponent complete');
        }
      } else {
        // Empty box - placing first rod
        // Check if we have the complementary rod
        const needed = box.targetSum - rod.length;
        const weHaveComplement = playerRods.some(id => {
          if (id === rodId) return false;
          const r = state.rods.get(id);
          return r && r.length === needed;
        });

        if (weHaveComplement) {
          score += 30;
          reasons.push('We have the completing rod');
        }

        // Prefer lower boxes to get points faster
        score += rod.length * 5;
      }

      // Small bonus for using longer rods (get them out of hand)
      score += rod.length * 2;

      moves.push({
        rodId,
        boxId,
        slot,
        score,
        reasoning: reasons.join('; ') || 'Standard placement',
        completesBox,
      });
    }
  }

  moves.sort((a, b) => b.score - a.score);
  return moves;
}

// =============================================================================
// Teaching Mode
// =============================================================================

/**
 * In easy mode, occasionally miss completing boxes
 */
function getTeachingMove(
  state: RamrodState,
  player: Player
): MoveOption | null {
  const moves = evaluateMoves(state, player, 'easy');

  if (moves.length === 0) return null;

  // 40% chance to pick a non-completing move
  if (Math.random() < 0.4) {
    const nonCompleting = moves.filter(m => !m.completesBox);
    if (nonCompleting.length > 0) {
      return nonCompleting[Math.floor(Math.random() * nonCompleting.length)];
    }
  }

  return moves[0];
}

// =============================================================================
// Public API
// =============================================================================

export interface AIMove {
  rodId: string;
  boxId: string;
  slot: number;
  hint?: string;
}

/**
 * Get AI's move decision
 */
export function getAIMove(
  state: RamrodState,
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
      return { rodId: result.rodId, boxId: result.boxId, slot: result.slot };
    }
  }

  const moves = evaluateMoves(state, aiPlayer, difficulty);

  if (moves.length === 0) return null;

  // Add randomness based on difficulty
  if (Math.random() < config.randomness && moves.length > 1) {
    const topMoves = moves.slice(0, 3);
    const chosen = topMoves[Math.floor(Math.random() * topMoves.length)];
    return { rodId: chosen.rodId, boxId: chosen.boxId, slot: chosen.slot };
  }

  return { rodId: moves[0].rodId, boxId: moves[0].boxId, slot: moves[0].slot };
}

/**
 * Check if it's the AI's turn
 */
export function isAITurn(
  state: RamrodState,
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
  state: RamrodState,
  aiPlayer: Player,
  difficulty: AIDifficulty = 'medium'
): RamrodState {
  const move = getAIMove(state, aiPlayer, difficulty);

  if (!move) {
    return passTurn(state);
  }

  let currentState = state;
  currentState = selectRod(currentState, move.rodId);
  currentState = placeRod(currentState, move.boxId, move.slot);

  return currentState;
}
