/**
 * Wave 41 — Frac Fact checkAnswer + submitAnswer wrong/right paths.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  POINTS_PER_CORRECT,
  STREAK_BONUS,
  type FractionProblem,
  type FracFactState,
} from '../../src/games/frac-fact/types';
import { checkAnswer, submitAnswer } from '../../src/games/frac-fact/rules';

const PROBLEM: FractionProblem = {
  id: 'problem-1',
  operand1: { numerator: 1, denominator: 2 },
  operand2: { numerator: 1, denominator: 3 },
  operation: 'add',
  correctAnswer: { numerator: 5, denominator: 6 },
  answerChoices: [
    { numerator: 5, denominator: 6 },
    { numerator: 2, denominator: 5 },
    { numerator: 1, denominator: 6 },
    { numerator: 1, denominator: 2 },
  ],
};

function playing(overrides: Partial<FracFactState> = {}): FracFactState {
  return {
    ...createInitialState('easy'),
    currentProblem: PROBLEM,
    phase: 'playing',
    ...overrides,
  };
}

describe('Wave 41 Frac Fact — checkAnswer / submitAnswer', () => {
  it('checkAnswer true for exact and equivalent; false for wrong', () => {
    expect(checkAnswer(PROBLEM, { numerator: 5, denominator: 6 })).toBe(true);
    expect(checkAnswer(PROBLEM, { numerator: 10, denominator: 12 })).toBe(true);
    expect(checkAnswer(PROBLEM, { numerator: 1, denominator: 2 })).toBe(false);
  });

  it('submitAnswer right awards points and advances streak', () => {
    const state = playing({
      player1Stats: {
        score: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        currentStreak: 1,
        bestStreak: 1,
      },
    });
    const next = submitAnswer(state, PROBLEM.correctAnswer);
    expect(next.isCorrect).toBe(true);
    expect(next.phase).toBe('showingResult');
    expect(next.selectedAnswer).toEqual(PROBLEM.correctAnswer);
    expect(next.player1Stats.correctAnswers).toBe(1);
    expect(next.player1Stats.wrongAnswers).toBe(0);
    expect(next.player1Stats.currentStreak).toBe(2);
    expect(next.player1Stats.bestStreak).toBe(2);
    expect(next.player1Stats.score).toBe(POINTS_PER_CORRECT + 1 * STREAK_BONUS);
    expect(next.problemHistory).toHaveLength(1);
    expect(next.problemHistory[0].isCorrect).toBe(true);
  });

  it('submitAnswer wrong zeros streak and increments wrongAnswers', () => {
    const state = playing({
      player1Stats: {
        score: 40,
        correctAnswers: 3,
        wrongAnswers: 0,
        currentStreak: 3,
        bestStreak: 3,
      },
    });
    const next = submitAnswer(state, { numerator: 1, denominator: 2 });
    expect(next.isCorrect).toBe(false);
    expect(next.phase).toBe('showingResult');
    expect(next.player1Stats.score).toBe(40);
    expect(next.player1Stats.wrongAnswers).toBe(1);
    expect(next.player1Stats.currentStreak).toBe(0);
    expect(next.player1Stats.bestStreak).toBe(3);
    expect(next.problemHistory[0].isCorrect).toBe(false);
  });

  it('submitAnswer identity outside playing or without problem', () => {
    const idle = createInitialState('easy');
    expect(submitAnswer(idle, PROBLEM.correctAnswer)).toBe(idle);
    const showing = playing({ phase: 'showingResult' });
    expect(submitAnswer(showing, PROBLEM.correctAnswer)).toBe(showing);
    const noProblem = playing({ currentProblem: null });
    expect(submitAnswer(noProblem, PROBLEM.correctAnswer)).toBe(noProblem);
  });
});
