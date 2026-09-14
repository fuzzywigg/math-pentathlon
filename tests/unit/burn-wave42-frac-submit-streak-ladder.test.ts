/**
 * Wave 42 — Frac-Fact streak ladder scoring + wrong resets. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  POINTS_PER_CORRECT,
  STREAK_BONUS,
} from '../../src/games/frac-fact/types';
import {
  startGame,
  submitAnswer,
  nextProblem,
  formatFraction,
  getOperationSymbol,
} from '../../src/games/frac-fact/rules';

describe('Wave 42 frac-fact — streak ladder', () => {
  it('two correct for p1 builds streak bonus on second', () => {
    let s = startGame(createInitialState('easy'));
    s = submitAnswer(s, s.currentProblem!.correctAnswer);
    expect(s.player1Stats.score).toBe(POINTS_PER_CORRECT);
    expect(s.player1Stats.currentStreak).toBe(1);
    s = nextProblem(s);
    s = submitAnswer(s, s.currentProblem!.correctAnswer);
    s = nextProblem(s);
    s = submitAnswer(s, s.currentProblem!.correctAnswer);
    expect(s.player1Stats.currentStreak).toBe(2);
    expect(s.player1Stats.score).toBe(
      POINTS_PER_CORRECT + (POINTS_PER_CORRECT + 1 * STREAK_BONUS)
    );
  });

  it('wrong answer resets streak without score bump', () => {
    let s = startGame(createInitialState('medium'));
    const wrong = s.currentProblem!.answerChoices.find(
      (a) =>
        a.numerator !== s.currentProblem!.correctAnswer.numerator ||
        a.denominator !== s.currentProblem!.correctAnswer.denominator
    )!;
    s = submitAnswer(s, wrong);
    expect(s.isCorrect).toBe(false);
    expect(s.player1Stats.currentStreak).toBe(0);
    expect(s.player1Stats.score).toBe(0);
    expect(s.player1Stats.wrongAnswers).toBe(1);
  });

  it('format + symbols', () => {
    expect(formatFraction({ numerator: 3, denominator: 1 })).toBe('3');
    expect(formatFraction({ numerator: 1, denominator: 2 })).toBe('1/2');
    expect(getOperationSymbol('add')).toBe('+');
    expect(getOperationSymbol('divide')).toBe('÷');
  });
});
