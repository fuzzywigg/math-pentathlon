// Frac Fact AI Module
// Strategic AI for fraction arithmetic game
//
// EDUCATIONAL NOTES:
// Frac Fact teaches fraction arithmetic: addition, subtraction,
// multiplication, and division.
//
// Strategy tips for learners:
// 1. To add/subtract fractions: find common denominator first!
// 2. To multiply: multiply numerators, multiply denominators
// 3. To divide: flip the second fraction and multiply
// 4. Always simplify your answer (divide by GCD)
// 5. Watch for distractors that use common mistakes

import {
  FracFactState,
  Player,
  FractionProblem,
} from './types';
import { Fraction } from '../../core/fractions/types';
import { areEquivalent } from '../../core/fractions/arithmetic';

export type AIDifficulty = 'easy' | 'medium' | 'hard';

const DIFFICULTY_CONFIG = {
  easy: { accuracy: 0.65, teachingMode: true },
  medium: { accuracy: 0.80, teachingMode: false },
  hard: { accuracy: 0.95, teachingMode: false },
};

// =============================================================================
// Answer Selection
// =============================================================================

/**
 * Find the correct answer index in the choices
 */
function findCorrectAnswerIndex(problem: FractionProblem): number {
  return problem.answerChoices.findIndex(
    choice => areEquivalent(choice, problem.correctAnswer)
  );
}

/**
 * Get AI's selected answer for a problem
 */
export function getAIAnswer(
  state: FracFactState,
  aiPlayer: Player,
  difficulty: AIDifficulty = 'medium'
): Fraction | null {
  if (state.phase !== 'playing') return null;
  if (state.currentPlayer !== aiPlayer) return null;
  if (!state.currentProblem) return null;

  const problem = state.currentProblem;
  const config = DIFFICULTY_CONFIG[difficulty];
  const choices = problem.answerChoices;

  const correctIndex = findCorrectAnswerIndex(problem);

  // Teaching mode: sometimes make intentional mistakes on easy mode
  // to model that mistakes are okay
  if (config.teachingMode && Math.random() < 0.35) {
    // Pick a random wrong answer
    const wrongIndices = choices.map((_, i) => i).filter(i => i !== correctIndex);
    if (wrongIndices.length > 0) {
      const selectedIndex = wrongIndices[Math.floor(Math.random() * wrongIndices.length)];
      return choices[selectedIndex];
    }
  }

  // Normal accuracy-based selection
  if (Math.random() < config.accuracy) {
    // Select correct answer
    return choices[correctIndex];
  } else {
    // Pick a random wrong answer
    const wrongIndices = choices.map((_, i) => i).filter(i => i !== correctIndex);
    if (wrongIndices.length > 0) {
      const selectedIndex = wrongIndices[Math.floor(Math.random() * wrongIndices.length)];
      return choices[selectedIndex];
    }
    // Fallback to correct if no wrong answers
    return choices[correctIndex];
  }
}

/**
 * Check if it's the AI's turn
 */
export function isAITurn(
  state: FracFactState,
  aiPlayer: Player | null
): boolean {
  if (!aiPlayer) return false;
  if (state.phase !== 'playing') return false;
  return state.currentPlayer === aiPlayer;
}
