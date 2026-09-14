/**
 * Overnight TOKENMAXX HEAVY leftover — Frac Fact nextProblem when already at max.
 * Distinct from wave41/42 settle at problemsCompleted = max-1. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { nextProblem } from '../../src/games/frac-fact/rules';
import { createInitialState } from '../../src/games/frac-fact/types';

describe('Wave 54 frac rules — nextProblem overshoot', () => {
  it('problemsCompleted === maxProblems still ends and clears selection', () => {
    const state = {
      ...createInitialState('easy'),
      phase: 'showingResult' as const,
      problemsCompleted: 10,
      maxProblems: 10,
      selectedAnswer: { numerator: 1, denominator: 2 },
      isCorrect: true,
      currentProblem: {
        id: 'last',
        operand1: { numerator: 1, denominator: 2 },
        operand2: { numerator: 1, denominator: 2 },
        operation: 'add' as const,
        correctAnswer: { numerator: 1, denominator: 1 },
        answerChoices: [{ numerator: 1, denominator: 1 }],
      },
      player1Stats: {
        score: 25,
        correctAnswers: 2,
        wrongAnswers: 0,
        currentStreak: 1,
        bestStreak: 1,
      },
      player2Stats: {
        score: 10,
        correctAnswers: 1,
        wrongAnswers: 0,
        currentStreak: 0,
        bestStreak: 1,
      },
    };
    const next = nextProblem(state);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player1');
    expect(next.problemsCompleted).toBe(11);
    expect(next.currentProblem).toBeNull();
    expect(next.selectedAnswer).toBeNull();
    expect(next.isCorrect).toBeNull();
  });
});
