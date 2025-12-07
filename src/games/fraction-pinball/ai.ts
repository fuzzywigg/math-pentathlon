// Fraction Pinball AI Module
// Strategic AI for fraction-decimal conversion game
//
// EDUCATIONAL NOTES:
// Fraction Pinball teaches converting between fractions and decimals.
// Key skills: Understanding fraction-decimal equivalents, mental math,
// recognizing common conversions.
//
// Strategy tips for learners:
// 1. Memorize common conversions: 1/2=0.5, 1/4=0.25, 3/4=0.75
// 2. 1/3=0.333..., 2/3=0.666... (repeating decimals)
// 3. 1/5=0.2, 2/5=0.4, 3/5=0.6, 4/5=0.8
// 4. To convert fraction to decimal: divide numerator by denominator
// 5. To convert decimal to fraction: use place value (0.75 = 75/100 = 3/4)

import {
  FractionPinballState,
  Player,
} from './types';

export type AIDifficulty = 'easy' | 'medium' | 'hard';

const DIFFICULTY_CONFIG = {
  easy: { accuracy: 0.60, teachingMode: true },
  medium: { accuracy: 0.78, teachingMode: false },
  hard: { accuracy: 0.92, teachingMode: false },
};

// =============================================================================
// Answer Selection
// =============================================================================

/**
 * Get AI's selected answer for a conversion challenge
 */
export function getAIAnswer(
  state: FractionPinballState,
  aiPlayer: Player,
  difficulty: AIDifficulty = 'medium'
): string | null {
  if (state.phase !== 'answering') return null;
  if (state.currentPlayer !== aiPlayer) return null;
  if (!state.currentChallenge) return null;

  const challenge = state.currentChallenge;
  const config = DIFFICULTY_CONFIG[difficulty];
  const choices = challenge.answerChoices;
  const correctAnswer = challenge.correctAnswer;

  // Teaching mode: intentionally miss sometimes to model learning
  if (config.teachingMode && Math.random() < 0.40) {
    const wrongChoices = choices.filter(c => c !== correctAnswer);
    if (wrongChoices.length > 0) {
      return wrongChoices[Math.floor(Math.random() * wrongChoices.length)];
    }
  }

  // Normal accuracy-based selection
  if (Math.random() < config.accuracy) {
    return correctAnswer;
  } else {
    const wrongChoices = choices.filter(c => c !== correctAnswer);
    if (wrongChoices.length > 0) {
      return wrongChoices[Math.floor(Math.random() * wrongChoices.length)];
    }
    return correctAnswer;
  }
}

/**
 * Check if it's the AI's turn
 */
export function isAITurn(
  state: FractionPinballState,
  aiPlayer: Player | null
): boolean {
  if (!aiPlayer) return false;
  if (state.phase !== 'answering') return false;
  return state.currentPlayer === aiPlayer;
}
