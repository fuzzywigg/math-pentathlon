/**
 * Overnight TOKENMAXX HEAVY leftovers after #250 — Frac Fact getAIAnswer gameOver null.
 * Wave54 covered showingResult. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getAIAnswer, isAITurn } from '../../src/games/frac-fact/ai';
import { createInitialState } from '../../src/games/frac-fact/types';

describe('Wave 55 frac AI — gameOver null', () => {
  it('gates getAIAnswer and isAITurn on gameOver', () => {
    const state = {
      ...createInitialState('medium'),
      phase: 'gameOver' as const,
      winner: 'player1' as const,
      currentPlayer: 'player1' as const,
      currentProblem: {
        id: 'gone',
        operand1: { numerator: 1, denominator: 2 },
        operand2: { numerator: 1, denominator: 2 },
        operation: 'add' as const,
        correctAnswer: { numerator: 1, denominator: 1 },
        answerChoices: [{ numerator: 1, denominator: 1 }],
      },
    };
    expect(getAIAnswer(state, 'player1', 'medium')).toBeNull();
    expect(isAITurn(state, 'player1')).toBe(false);
  });
});
