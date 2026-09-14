/**
 * Overnight TOKENMAXX HEAVY leftovers after #260 — Frac Fact wrong submit resets streak.
 * Wave56 covered bestStreak on correct; wrong→0 streak unasserted overnight. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { startGame, submitAnswer } from '../../src/games/frac-fact/rules';
import { areEquivalent } from '../../src/core/fractions/arithmetic';

describe('Wave 57 frac rules — wrong resets streak', () => {
  it('incorrect answer clears currentStreak leftover', () => {
    let state = startGame(createInitialState('easy'));
    state = {
      ...state,
      player1Stats: {
        ...state.player1Stats,
        currentStreak: 3,
        bestStreak: 3,
        score: 30,
      },
    };
    const wrong = state.currentProblem!.answerChoices.find(
      (c) => !areEquivalent(c, state.currentProblem!.correctAnswer)
    )!;
    const next = submitAnswer(state, wrong);
    expect(next.isCorrect).toBe(false);
    expect(next.player1Stats.currentStreak).toBe(0);
    expect(next.player1Stats.bestStreak).toBe(3);
    expect(next.player1Stats.wrongAnswers).toBe(1);
    expect(next.player1Stats.score).toBe(30);
  });
});
