/**
 * Overnight TOKENMAXX HEAVY leftovers after #250 — Pinball p2 miss drains only p2 balls.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { startGame, submitAnswer } from '../../src/games/fraction-pinball/rules';

describe('Wave 55 pinball rules — p2 miss balls', () => {
  it('wrong p2 answer decrements only p2 ballsRemaining', () => {
    const started = {
      ...startGame(createInitialState()),
      currentPlayer: 'player2' as const,
    };
    const wrong =
      started.currentChallenge!.answerChoices.find(
        (c) => c !== started.currentChallenge!.correctAnswer
      ) ?? 'nope';
    const next = submitAnswer(started, wrong);
    expect(next.player1Stats).toEqual(started.player1Stats);
    expect(next.player2Stats.ballsRemaining).toBe(4);
    expect(next.player2Stats.wrongAnswers).toBe(1);
    expect(next.isCorrect).toBe(false);
  });
});
