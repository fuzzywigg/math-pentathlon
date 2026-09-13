// Fab-a-Diffy AI Module
// Strategic AI for fraction combination game
//
// EDUCATIONAL NOTES:
// Fab-a-Diffy teaches fraction operations and equivalent fractions.
// Key skills: Adding/subtracting fractions, multiplying/dividing fractions,
// recognizing equivalent fractions, mental math with fractions.
//
// Strategy tips for learners:
// 1. Look for fractions with the same denominator - they're easier to add/subtract
// 2. Multiplying fractions is easy: just multiply tops and bottoms
// 3. Dividing is like multiplying by the flipped fraction (reciprocal)
// 4. Some answers can be made multiple ways - find the one using bars you want to use
// 5. Check if your answer simplifies to match a target (2/4 = 1/2)

import { FabADiffyState, Player, FractionBar } from './types';

import { FractionOperation } from '../../core/fractions/types';
import { areEquivalent } from '../../core/fractions/arithmetic';

import {
  selectBar1,
  selectBar2,
  selectOperation,
  executeMove,
  passTurn,
  getPossibleResults,
  calculateResult,
} from './rules';

export type AIDifficulty = 'easy' | 'medium' | 'hard';

const DIFFICULTY_CONFIG = {
  easy: { randomness: 0.5, teachingMode: true },
  medium: { randomness: 0.15, teachingMode: false },
  hard: { randomness: 0.03, teachingMode: false },
};

// =============================================================================
// Move Analysis
// =============================================================================

interface ValidMove {
  bar1Id: string;
  bar2Id: string;
  operation: FractionOperation;
  answerId: string;
  score: number;
  reasoning: string;
}

/**
 * Find all valid moves for the current player.
 * Uses ordered bar pairs so subtract/divide match executeMove(bar1 op bar2).
 */
function findAllValidMoves(state: FabADiffyState): ValidMove[] {
  const moves: ValidMove[] = [];

  const availableBars = Array.from(state.fractionBars.values()).filter(
    (b) => !b.used
  );
  const unclaimedAnswers = Array.from(state.answerBars.values()).filter(
    (a) => !a.claimedBy
  );

  if (availableBars.length < 2) return moves;

  const operations: FractionOperation[] = [
    'add',
    'subtract',
    'multiply',
    'divide',
  ];

  const orderedPairs: Array<[FractionBar, FractionBar]> = [];
  for (let i = 0; i < availableBars.length; i++) {
    for (let j = 0; j < availableBars.length; j++) {
      if (i === j) continue;
      orderedPairs.push([availableBars[i], availableBars[j]]);
    }
  }

  for (const [bar1, bar2] of orderedPairs) {
    for (const operation of operations) {
      // Skip duplicate commutative ops (add/multiply) for reverse order
      if (
        (operation === 'add' || operation === 'multiply') &&
        bar1.id > bar2.id
      ) {
        continue;
      }

      const result = calculateResult(bar1.fraction, bar2.fraction, operation);
      if (!result || result.numerator < 0) continue;

      const matchingAnswers = unclaimedAnswers.filter((a) =>
        areEquivalent(a.fraction, result)
      );

      for (const answer of matchingAnswers) {
        let score = 10;
        const reasons: string[] = [];

        if (bar1.fraction.denominator === bar2.fraction.denominator) {
          score += 5;
          reasons.push('Same denominator makes calculation easier');
        }

        if (operation === 'add' || operation === 'subtract') {
          score += 3;
        } else if (operation === 'multiply') {
          score += 2;
        }

        let alternateWays = 0;
        for (let k = 0; k < availableBars.length; k++) {
          for (let l = k + 1; l < availableBars.length; l++) {
            const a = availableBars[k];
            const b = availableBars[l];
            if (
              (a.id === bar1.id && b.id === bar2.id) ||
              (a.id === bar2.id && b.id === bar1.id)
            ) {
              continue;
            }
            const otherResults = getPossibleResults(a, b);
            if (
              otherResults.some((r) => areEquivalent(r.result, answer.fraction))
            ) {
              alternateWays++;
            }
          }
        }

        if (alternateWays === 0) {
          score += 20;
          reasons.push('Only way to make this answer - grab it!');
        } else if (alternateWays <= 2) {
          score += 10;
          reasons.push('Few ways to make this answer');
        }

        if (answer.fraction.denominator <= 4) {
          score += 5;
          reasons.push('Simple fraction target');
        }

        moves.push({
          bar1Id: bar1.id,
          bar2Id: bar2.id,
          operation,
          answerId: answer.id,
          score,
          reasoning: reasons.join('; ') || 'Valid combination',
        });
      }
    }
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
function getTeachingMove(state: FabADiffyState): ValidMove | null {
  const moves = findAllValidMoves(state);

  if (moves.length === 0) return null;

  // 40% chance to pick a lower-scoring move
  if (Math.random() < 0.4 && moves.length > 1) {
    const suboptimal = moves.slice(1);
    if (suboptimal.length > 0) {
      return suboptimal[Math.floor(Math.random() * suboptimal.length)];
    }
  }

  return moves[0];
}

// =============================================================================
// Public API
// =============================================================================

export interface AIMove {
  bar1Id: string;
  bar2Id: string;
  operation: FractionOperation;
  answerId: string;
  hint?: string;
}

/**
 * Get AI's move decision
 */
export function getAIMove(
  state: FabADiffyState,
  aiPlayer: Player,
  difficulty: AIDifficulty = 'medium'
): AIMove | null {
  if (state.phase === 'gameOver') return null;
  if (state.currentPlayer !== aiPlayer) return null;

  const config = DIFFICULTY_CONFIG[difficulty];

  // Teaching mode for easy difficulty
  if (config.teachingMode) {
    const result = getTeachingMove(state);
    if (result) {
      return {
        bar1Id: result.bar1Id,
        bar2Id: result.bar2Id,
        operation: result.operation,
        answerId: result.answerId,
      };
    }
  }

  const moves = findAllValidMoves(state);

  if (moves.length === 0) return null;

  // Add randomness based on difficulty
  if (Math.random() < config.randomness && moves.length > 1) {
    const topMoves = moves.slice(0, 3);
    const chosen = topMoves[Math.floor(Math.random() * topMoves.length)];
    return {
      bar1Id: chosen.bar1Id,
      bar2Id: chosen.bar2Id,
      operation: chosen.operation,
      answerId: chosen.answerId,
    };
  }

  return {
    bar1Id: moves[0].bar1Id,
    bar2Id: moves[0].bar2Id,
    operation: moves[0].operation,
    answerId: moves[0].answerId,
  };
}

/**
 * Check if it's the AI's turn
 */
export function isAITurn(
  state: FabADiffyState,
  aiPlayer: Player | null,
  gameMode: 'human-vs-human' | 'human-vs-ai'
): boolean {
  if (gameMode !== 'human-vs-ai') return false;
  if (!aiPlayer) return false;
  if (state.phase === 'gameOver') return false;

  return state.currentPlayer === aiPlayer;
}

/**
 * Apply a concrete AI move with per-step phase validation (#12).
 * Any failed step falls back to passTurn — never silently stalls.
 */
export function applyAIMoveSteps(
  state: FabADiffyState,
  move: AIMove
): FabADiffyState {
  let currentState = selectBar1(state, move.bar1Id);
  if (currentState.phase !== 'selectingBar2') {
    console.error('AI: selectBar1 failed', { move, phase: currentState.phase });
    return passTurn(state);
  }

  currentState = selectBar2(currentState, move.bar2Id);
  if (currentState.phase !== 'selectingOperation') {
    console.error('AI: selectBar2 failed', { move, phase: currentState.phase });
    return passTurn(state);
  }

  currentState = selectOperation(currentState, move.operation);
  if (currentState.phase !== 'confirmingMove') {
    console.error('AI: selectOperation failed', {
      move,
      phase: currentState.phase,
    });
    return passTurn(state);
  }

  currentState = executeMove(currentState, move.answerId);
  if (currentState.phase === 'confirmingMove') {
    console.error('AI: executeMove failed', {
      move,
      phase: currentState.phase,
    });
    return passTurn(state);
  }

  return currentState;
}

/**
 * Execute a complete AI turn with per-step phase validation (#12).
 */
export function executeAITurn(
  state: FabADiffyState,
  aiPlayer: Player,
  difficulty: AIDifficulty = 'medium'
): FabADiffyState {
  const move = getAIMove(state, aiPlayer, difficulty);

  if (!move) {
    return passTurn(state);
  }

  return applyAIMoveSteps(state, move);
}
