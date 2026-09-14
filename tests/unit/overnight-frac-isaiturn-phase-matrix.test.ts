/**
 * Overnight HEAVY — Frac Fact isAITurn phase/seat matrix.
 * Distinct leftover vs wave42 partial gates. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { isAITurn, getAIAnswer } from '../../src/games/frac-fact/ai';
import { createInitialState } from '../../src/games/frac-fact/types';

describe('Overnight frac — isAITurn / null gates', () => {
  it('false for null ai, wrong phase, wrong seat', () => {
    const playing = {
      ...createInitialState('easy'),
      phase: 'playing' as const,
      currentPlayer: 'player1' as const,
      currentProblem: {
        id: 'x',
        operand1: { numerator: 1, denominator: 2 },
        operand2: { numerator: 1, denominator: 2 },
        operation: 'add' as const,
        correctAnswer: { numerator: 1, denominator: 1 },
        answerChoices: [{ numerator: 1, denominator: 1 }],
      },
    };
    expect(isAITurn(playing, null)).toBe(false);
    expect(isAITurn(playing, 'player2')).toBe(false);
    expect(isAITurn({ ...playing, phase: 'showingResult' }, 'player1')).toBe(
      false
    );
    expect(isAITurn({ ...playing, phase: 'gameOver' }, 'player1')).toBe(false);
    expect(isAITurn(playing, 'player1')).toBe(true);
  });

  it('getAIAnswer null without problem even when playing', () => {
    const state = {
      ...createInitialState('medium'),
      phase: 'playing' as const,
      currentProblem: null,
    };
    expect(getAIAnswer(state, 'player1', 'medium')).toBeNull();
  });
});
