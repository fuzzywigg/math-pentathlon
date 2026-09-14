/**
 * Wave 41 — Frac Fact submitAnswer streak bonus + wrong reset.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  POINTS_PER_CORRECT,
  STREAK_BONUS,
} from '../../src/games/frac-fact/types';
import { startGame, submitAnswer, checkAnswer } from '../../src/games/frac-fact/rules';

describe('Wave 41 Frac Fact — streak bonus submit', () => {
  it('correct answer awards POINTS_PER_CORRECT + streak*STREAK_BONUS', () => {
    let state = startGame(createInitialState('easy'));
    const problem = state.currentProblem!;
    state = submitAnswer(state, problem.correctAnswer);
    expect(state.phase).toBe('showingResult');
    expect(state.isCorrect).toBe(true);
    expect(state.player1Stats.score).toBe(POINTS_PER_CORRECT); // streak was 0
    expect(state.player1Stats.currentStreak).toBe(1);
    expect(state.player1Stats.correctAnswers).toBe(1);
  });

  it('second correct stacks streak bonus from prior streak', () => {
    let state = startGame(createInitialState('easy'));
    state = {
      ...state,
      player1Stats: {
        ...state.player1Stats,
        currentStreak: 2,
        score: 20,
        correctAnswers: 2,
      },
    };
    const ans = state.currentProblem!.correctAnswer;
    state = submitAnswer(state, ans);
    expect(state.player1Stats.score).toBe(20 + POINTS_PER_CORRECT + 2 * STREAK_BONUS);
    expect(state.player1Stats.currentStreak).toBe(3);
    expect(state.player1Stats.bestStreak).toBeGreaterThanOrEqual(3);
  });

  it('wrong answer resets streak and increments wrongAnswers', () => {
    let state = startGame(createInitialState('easy'));
    state = {
      ...state,
      player1Stats: { ...state.player1Stats, currentStreak: 4, bestStreak: 4 },
    };
    const wrong = { numerator: 999, denominator: 1 };
    expect(checkAnswer(state.currentProblem!, wrong)).toBe(false);
    state = submitAnswer(state, wrong);
    expect(state.isCorrect).toBe(false);
    expect(state.player1Stats.currentStreak).toBe(0);
    expect(state.player1Stats.bestStreak).toBe(4);
    expect(state.player1Stats.wrongAnswers).toBe(1);
    expect(state.player1Stats.score).toBe(0);
  });

  it('submitAnswer identity wrong phase', () => {
    const state = createInitialState();
    expect(submitAnswer(state, { numerator: 1, denominator: 2 })).toBe(state);
  });
});
