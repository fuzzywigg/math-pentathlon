import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  FractionProblem,
  FracFactState,
  POINTS_PER_CORRECT,
  STREAK_BONUS,
} from '../../src/games/frac-fact/types';
import {
  checkAnswer,
  submitAnswer,
  nextProblem,
  startGame,
  formatFraction,
  getOperationSymbol,
} from '../../src/games/frac-fact/rules';

const FIXED_PROBLEM: FractionProblem = {
  id: 'problem-1',
  operand1: { numerator: 1, denominator: 2 },
  operand2: { numerator: 1, denominator: 4 },
  operation: 'add',
  correctAnswer: { numerator: 3, denominator: 4 },
  answerChoices: [
    { numerator: 3, denominator: 4 },
    { numerator: 1, denominator: 2 },
    { numerator: 2, denominator: 6 },
    { numerator: 1, denominator: 4 },
  ],
};

function playingState(overrides: Partial<FracFactState> = {}): FracFactState {
  return {
    ...createInitialState('easy'),
    currentProblem: FIXED_PROBLEM,
    phase: 'playing',
    ...overrides,
  };
}

describe('Frac Fact – helpers', () => {
  it('formats whole numbers and proper fractions', () => {
    expect(formatFraction({ numerator: 3, denominator: 1 })).toBe('3');
    expect(formatFraction({ numerator: 1, denominator: 2 })).toBe('1/2');
  });

  it('maps operations to display symbols', () => {
    expect(getOperationSymbol('add')).toBe('+');
    expect(getOperationSymbol('subtract')).toBe('−');
    expect(getOperationSymbol('multiply')).toBe('×');
    expect(getOperationSymbol('divide')).toBe('÷');
  });

  it('checkAnswer accepts equivalent fractions', () => {
    expect(checkAnswer(FIXED_PROBLEM, { numerator: 3, denominator: 4 })).toBe(
      true
    );
    expect(checkAnswer(FIXED_PROBLEM, { numerator: 6, denominator: 8 })).toBe(
      true
    );
    expect(checkAnswer(FIXED_PROBLEM, { numerator: 1, denominator: 2 })).toBe(
      false
    );
  });
});

describe('Frac Fact – scoring flow', () => {
  it('startGame installs the first problem', () => {
    const started = startGame(createInitialState('easy'));
    expect(started.phase).toBe('playing');
    expect(started.currentProblem).not.toBeNull();
    expect(started.currentProblem!.answerChoices.length).toBeGreaterThanOrEqual(
      2
    );
  });

  it('awards points and streak on a correct answer', () => {
    const state = playingState({
      player1Stats: {
        score: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        currentStreak: 2,
        bestStreak: 2,
      },
    });
    const next = submitAnswer(state, FIXED_PROBLEM.correctAnswer);

    expect(next.isCorrect).toBe(true);
    expect(next.phase).toBe('showingResult');
    expect(next.player1Stats.score).toBe(POINTS_PER_CORRECT + 2 * STREAK_BONUS);
    expect(next.player1Stats.currentStreak).toBe(3);
    expect(next.player1Stats.bestStreak).toBe(3);
  });

  it('zeros the streak on a wrong answer', () => {
    const state = playingState({
      player1Stats: {
        score: 20,
        correctAnswers: 2,
        wrongAnswers: 0,
        currentStreak: 2,
        bestStreak: 2,
      },
    });
    const next = submitAnswer(state, { numerator: 1, denominator: 2 });

    expect(next.isCorrect).toBe(false);
    expect(next.player1Stats.score).toBe(20);
    expect(next.player1Stats.currentStreak).toBe(0);
    expect(next.player1Stats.wrongAnswers).toBe(1);
  });

  it('nextProblem ends the game when maxProblems is reached', () => {
    const state = playingState({
      maxProblems: 1,
      problemsCompleted: 0,
      phase: 'showingResult',
      isCorrect: true,
      selectedAnswer: FIXED_PROBLEM.correctAnswer,
      player1Stats: {
        score: 15,
        correctAnswers: 1,
        wrongAnswers: 0,
        currentStreak: 1,
        bestStreak: 1,
      },
    });
    const over = nextProblem(state);
    expect(over.phase).toBe('gameOver');
    expect(over.winner).toBe('player1');
    expect(over.currentProblem).toBeNull();
  });

  it('nextProblem otherwise advances to the opponent', () => {
    const state = playingState({
      maxProblems: 4,
      problemsCompleted: 0,
      phase: 'showingResult',
    });
    const next = nextProblem(state);
    expect(next.phase).toBe('playing');
    expect(next.currentPlayer).toBe('player2');
    expect(next.problemsCompleted).toBe(1);
    expect(next.currentProblem).not.toBeNull();
  });
});
