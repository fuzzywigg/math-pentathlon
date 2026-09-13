import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  createInitialState,
  POINTS_PER_CORRECT,
  FractionProblem,
  FracFactState,
} from '../../src/games/frac-fact/types';
import {
  checkAnswer,
  submitAnswer,
  nextProblem,
  startGame,
  formatFraction,
  getOperationSymbol,
} from '../../src/games/frac-fact/rules';
import { FractionOperation } from '../../src/core/fractions/types';

afterEach(() => {
  vi.restoreAllMocks();
});

const fixedProblem: FractionProblem = {
  id: 'problem-test',
  operand1: { numerator: 1, denominator: 2 },
  operand2: { numerator: 1, denominator: 4 },
  operation: 'add',
  correctAnswer: { numerator: 3, denominator: 4 },
  answerChoices: [
    { numerator: 3, denominator: 4 },
    { numerator: 1, denominator: 2 },
    { numerator: 2, denominator: 4 },
    { numerator: 1, denominator: 4 },
  ],
};

function withProblem(state: FracFactState = createInitialState()): FracFactState {
  return {
    ...state,
    currentProblem: fixedProblem,
    phase: 'playing',
  };
}

describe('Frac Fact – answer checking and scoring', () => {
  it('checkAnswer accepts equivalent correct fractions', () => {
    expect(checkAnswer(fixedProblem, { numerator: 3, denominator: 4 })).toBe(
      true
    );
    expect(checkAnswer(fixedProblem, { numerator: 6, denominator: 8 })).toBe(
      true
    );
    expect(checkAnswer(fixedProblem, { numerator: 1, denominator: 2 })).toBe(
      false
    );
  });

  it('correct submit bumps score by POINTS_PER_CORRECT', () => {
    const state = withProblem(startGame(createInitialState()));
    // Replace random problem with fixed one
    const prepared = withProblem({
      ...state,
      currentProblem: fixedProblem,
    });

    const next = submitAnswer(prepared, { numerator: 3, denominator: 4 });

    expect(next.isCorrect).toBe(true);
    expect(next.phase).toBe('showingResult');
    expect(next.player1Stats.score).toBe(POINTS_PER_CORRECT);
    expect(next.player1Stats.correctAnswers).toBe(1);
    expect(next.player1Stats.currentStreak).toBe(1);
  });

  it('wrong answer zeros the streak', () => {
    const state = withProblem({
      ...createInitialState(),
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
    expect(next.player1Stats.currentStreak).toBe(0);
    expect(next.player1Stats.wrongAnswers).toBe(1);
    expect(next.player1Stats.score).toBe(20); // unchanged
    expect(next.player1Stats.bestStreak).toBe(2);
  });

  it('nextProblem with maxProblems=1 goes gameOver', () => {
    let state = withProblem({
      ...createInitialState(),
      maxProblems: 1,
      problemsCompleted: 0,
    });
    state = submitAnswer(state, { numerator: 3, denominator: 4 });
    const next = nextProblem(state);

    expect(next.phase).toBe('gameOver');
    expect(next.problemsCompleted).toBe(1);
    expect(next.currentProblem).toBeNull();
    expect(next.winner).toBe('player1');
  });
});

describe('Frac Fact – display helpers', () => {
  it("formatFraction({1,2}) === '1/2'", () => {
    expect(formatFraction({ numerator: 1, denominator: 2 })).toBe('1/2');
    expect(formatFraction({ numerator: 5, denominator: 1 })).toBe('5');
  });

  it('getOperationSymbol is exhaustive for all operations', () => {
    const cases: Record<FractionOperation, string> = {
      add: '+',
      subtract: '−',
      multiply: '×',
      divide: '÷',
    };

    (Object.keys(cases) as FractionOperation[]).forEach((op) => {
      expect(getOperationSymbol(op)).toBe(cases[op]);
    });

    // Exhaustiveness: every union member handled above
    const allOps: FractionOperation[] = [
      'add',
      'subtract',
      'multiply',
      'divide',
    ];
    expect(allOps).toHaveLength(4);
    for (const op of allOps) {
      const symbol = getOperationSymbol(op);
      expect(typeof symbol).toBe('string');
      expect(symbol.length).toBeGreaterThan(0);
    }
  });
});
