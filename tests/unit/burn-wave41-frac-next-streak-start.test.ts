/**
 * Wave 41 — Frac Fact nextProblem streak handoff + startGame + gameOver.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  createInitialState,
  type FractionProblem,
  type FracFactState,
} from '../../src/games/frac-fact/types';
import {
  startGame,
  nextProblem,
  submitAnswer,
} from '../../src/games/frac-fact/rules';

afterEach(() => vi.restoreAllMocks());

const PROBLEM: FractionProblem = {
  id: 'problem-1',
  operand1: { numerator: 1, denominator: 4 },
  operand2: { numerator: 1, denominator: 4 },
  operation: 'add',
  correctAnswer: { numerator: 1, denominator: 2 },
  answerChoices: [
    { numerator: 1, denominator: 2 },
    { numerator: 1, denominator: 4 },
    { numerator: 2, denominator: 4 },
    { numerator: 1, denominator: 8 },
  ],
};

function seedVaryingRandom() {
  let i = 0;
  const seq = [0.2, 0.45, 0.7, 0.15, 0.9, 0.33, 0.55, 0.8];
  vi.spyOn(Math, 'random').mockImplementation(() => {
    const v = seq[i % seq.length];
    i++;
    return v;
  });
}

describe('Wave 41 Frac Fact — nextProblem / startGame', () => {
  it('startGame installs first problem in playing phase', () => {
    seedVaryingRandom();
    const started = startGame(createInitialState('medium'));
    expect(started.phase).toBe('playing');
    expect(started.currentProblem).not.toBeNull();
    expect(started.currentProblem!.id).toBe('problem-1');
    expect(started.difficulty).toBe('medium');
  });

  it('nextProblem after correct answer switches seat and keeps streak stats', () => {
    seedVaryingRandom();
    let state: FracFactState = {
      ...createInitialState('easy'),
      currentProblem: PROBLEM,
      phase: 'playing',
      maxProblems: 5,
    };
    state = submitAnswer(state, PROBLEM.correctAnswer);
    expect(state.player1Stats.currentStreak).toBe(1);
    const next = nextProblem(state);
    expect(next.phase).toBe('playing');
    expect(next.currentPlayer).toBe('player2');
    expect(next.problemsCompleted).toBe(1);
    expect(next.selectedAnswer).toBeNull();
    expect(next.isCorrect).toBeNull();
    expect(next.currentProblem).not.toBeNull();
    expect(next.player1Stats.currentStreak).toBe(1);
  });

  it('nextProblem at maxProblems settles winner by score or null tie', () => {
    const base: FracFactState = {
      ...createInitialState('easy'),
      currentProblem: PROBLEM,
      phase: 'showingResult',
      problemsCompleted: 9,
      maxProblems: 10,
      player1Stats: {
        score: 30,
        correctAnswers: 3,
        wrongAnswers: 0,
        currentStreak: 1,
        bestStreak: 2,
      },
      player2Stats: {
        score: 10,
        correctAnswers: 1,
        wrongAnswers: 2,
        currentStreak: 0,
        bestStreak: 1,
      },
    };
    const p1Wins = nextProblem(base);
    expect(p1Wins.phase).toBe('gameOver');
    expect(p1Wins.winner).toBe('player1');
    expect(p1Wins.currentProblem).toBeNull();

    const tie = nextProblem({
      ...base,
      player2Stats: { ...base.player2Stats, score: 30 },
    });
    expect(tie.phase).toBe('gameOver');
    expect(tie.winner).toBeNull();

    const p2Wins = nextProblem({
      ...base,
      player1Stats: { ...base.player1Stats, score: 5 },
      player2Stats: { ...base.player2Stats, score: 40 },
    });
    expect(p2Wins.winner).toBe('player2');
  });
});
