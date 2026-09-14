/**
 * Wave 45 TOKENMAXX — Pinball submitAnswer correct awards points. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { startGame, submitAnswer } from '../../src/games/fraction-pinball/rules';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Wave 45 pinball — correct submit', () => {
  it('correct answer increases score and keeps balls', () => {
    const live = startGame(createInitialState());
    vi.spyOn(Math, 'random').mockReturnValue(0); // first target only
    const correct = live.currentChallenge!.correctAnswer;
    const before = live.player1Stats;
    const next = submitAnswer(live, correct);
    expect(next.phase).toBe('showResult');
    expect(next.isCorrect).toBe(true);
    expect(next.player1Stats.score).toBeGreaterThan(before.score);
    expect(next.player1Stats.ballsRemaining).toBe(before.ballsRemaining);
    expect(next.player1Stats.correctAnswers).toBe(before.correctAnswers + 1);
  });
});
