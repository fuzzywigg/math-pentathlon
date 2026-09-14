/**
 * Overnight TOKENMAXX HEAVY leftover — Frac Fact getAIAnswer null on showingResult
 * even when a problem is loaded. Distinct from no-problem null. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getAIAnswer, isAITurn } from '../../src/games/frac-fact/ai';
import { createInitialState } from '../../src/games/frac-fact/types';

describe('Wave 54 frac AI — showingResult with problem', () => {
  it('isAITurn false and getAIAnswer null while showingResult', () => {
    const state = {
      ...createInitialState('hard'),
      phase: 'showingResult' as const,
      currentPlayer: 'player1' as const,
      currentProblem: {
        id: 'shown',
        operand1: { numerator: 1, denominator: 2 },
        operand2: { numerator: 1, denominator: 2 },
        operation: 'add' as const,
        correctAnswer: { numerator: 1, denominator: 1 },
        answerChoices: [
          { numerator: 1, denominator: 1 },
          { numerator: 1, denominator: 2 },
        ],
      },
      selectedAnswer: { numerator: 1, denominator: 1 },
      isCorrect: true,
    };
    expect(isAITurn(state, 'player1')).toBe(false);
    expect(getAIAnswer(state, 'player1', 'hard')).toBeNull();
  });
});
