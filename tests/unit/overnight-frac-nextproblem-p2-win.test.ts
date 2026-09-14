/**
 * Overnight HEAVY — Frac Fact nextProblem awards p2 win when score leads.
 * Distinct leftover vs forged settle without p2 scoring. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { nextProblem } from '../../src/games/frac-fact/rules';
import { createInitialState } from '../../src/games/frac-fact/types';

describe('Overnight frac — nextProblem p2 win', () => {
  it('ends with player2 winner when p2 score higher at maxProblems', () => {
    const state = {
      ...createInitialState('easy'),
      phase: 'showingResult' as const,
      problemsCompleted: 9,
      maxProblems: 10,
      player1Stats: {
        score: 10,
        correctAnswers: 1,
        wrongAnswers: 0,
        currentStreak: 0,
        bestStreak: 1,
      },
      player2Stats: {
        score: 40,
        correctAnswers: 2,
        wrongAnswers: 0,
        currentStreak: 0,
        bestStreak: 2,
      },
    };
    const next = nextProblem(state);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player2');
    expect(next.currentProblem).toBeNull();
  });
});
