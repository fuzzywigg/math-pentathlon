/**
 * Wave 48 — Pinball submit wrong drains ball. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { startGame, submitAnswer } from '../../src/games/fraction-pinball/rules';

afterEach(() => vi.restoreAllMocks());

describe('Wave 48 pinball — wrong ball drain', () => {
  it('wrong answer decrements ballsRemaining', () => {
    let i = 0;
    const seq = [0.13, 0.24, 0.35, 0.46, 0.57, 0.68, 0.79, 0.81, 0.14, 0.25, 0.36, 0.47, 0.58, 0.69, 0.71];
    vi.spyOn(Math, 'random').mockImplementation(() => seq[i++ % seq.length]);
    const started = startGame(createInitialState());
    const wrong = started.currentChallenge!.answerChoices.find(
      (c) => c !== started.currentChallenge!.correctAnswer
    )!;
    const before = started.player1Stats.ballsRemaining;
    const next = submitAnswer(started, wrong);
    expect(next.isCorrect).toBe(false);
    expect(next.player1Stats.ballsRemaining).toBe(before - 1);
  });
});
