/**
 * Overnight HEAVY — Frac Fact submitAnswer awards player2 stats on p2 seat.
 * Distinct leftover vs wave41 p1-only submit paths. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { submitAnswer } from '../../src/games/frac-fact/rules';
import {
  createInitialState,
  POINTS_PER_CORRECT,
  type FractionProblem,
  type FracFactState,
} from '../../src/games/frac-fact/types';

const PROBLEM: FractionProblem = {
  id: 'p2',
  operand1: { numerator: 1, denominator: 2 },
  operand2: { numerator: 1, denominator: 2 },
  operation: 'add',
  correctAnswer: { numerator: 1, denominator: 1 },
  answerChoices: [
    { numerator: 1, denominator: 1 },
    { numerator: 1, denominator: 2 },
  ],
};

function playing(overrides: Partial<FracFactState> = {}): FracFactState {
  return {
    ...createInitialState('easy'),
    phase: 'playing',
    currentPlayer: 'player2',
    currentProblem: PROBLEM,
    ...overrides,
  };
}

describe('Overnight frac — p2 submit score', () => {
  it('correct answer increments player2Stats only', () => {
    const next = submitAnswer(playing(), PROBLEM.correctAnswer);
    expect(next.isCorrect).toBe(true);
    expect(next.player2Stats.correctAnswers).toBe(1);
    expect(next.player2Stats.score).toBe(POINTS_PER_CORRECT);
    expect(next.player1Stats.correctAnswers).toBe(0);
    expect(next.player1Stats.score).toBe(0);
    expect(next.problemHistory[0].player).toBe('player2');
  });

  it('wrong answer increments player2 wrongAnswers only', () => {
    const next = submitAnswer(playing(), { numerator: 1, denominator: 2 });
    expect(next.isCorrect).toBe(false);
    expect(next.player2Stats.wrongAnswers).toBe(1);
    expect(next.player1Stats.wrongAnswers).toBe(0);
  });
});
