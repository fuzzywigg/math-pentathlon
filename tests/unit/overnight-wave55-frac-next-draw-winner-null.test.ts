/**
 * Overnight TOKENMAXX HEAVY leftovers after #250 — Frac Fact nextProblem tied scores winner null.
 * Distinct from p1/p2 win leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { nextProblem } from '../../src/games/frac-fact/rules';
import { createInitialState } from '../../src/games/frac-fact/types';

describe('Wave 55 frac rules — draw winner null', () => {
  it('equal scores at max problems leave winner null', () => {
    const stats = {
      score: 40,
      correctAnswers: 4,
      wrongAnswers: 1,
      currentStreak: 0,
      bestStreak: 2,
    };
    const next = nextProblem({
      ...createInitialState('easy'),
      phase: 'showingResult',
      problemsCompleted: 9,
      maxProblems: 10,
      player1Stats: stats,
      player2Stats: { ...stats },
      currentProblem: {
        id: 'last',
        operand1: { numerator: 1, denominator: 2 },
        operand2: { numerator: 1, denominator: 2 },
        operation: 'add',
        correctAnswer: { numerator: 1, denominator: 1 },
        answerChoices: [{ numerator: 1, denominator: 1 }],
      },
    });
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBeNull();
  });
});
