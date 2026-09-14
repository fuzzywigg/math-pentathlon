/**
 * Overnight TOKENMAXX HEAVY leftovers after #250 — Frac Fact player2 miss leaves player1 stats.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { startGame, submitAnswer } from '../../src/games/frac-fact/rules';

describe('Wave 55 frac rules — p2 miss leaves p1', () => {
  it('wrong p2 answer increments only p2 wrongAnswers', () => {
    const started = {
      ...startGame(createInitialState('easy')),
      currentPlayer: 'player2' as const,
    };
    const wrong = started.currentProblem!.answerChoices.find(
      (c) =>
        c.numerator !== started.currentProblem!.correctAnswer.numerator ||
        c.denominator !== started.currentProblem!.correctAnswer.denominator
    ) ?? { numerator: 99, denominator: 1 };
    const next = submitAnswer(started, wrong);
    expect(next.player1Stats).toEqual(started.player1Stats);
    expect(next.player2Stats.wrongAnswers).toBe(1);
    expect(next.player2Stats.currentStreak).toBe(0);
    expect(next.isCorrect).toBe(false);
  });
});
