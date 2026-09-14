/**
 * Wave 42 — Fraction Pinball submitAnswer phase / showResult identity.
 * Beyond wave41 gameOver identity. Tests-only.
 * Mock Math.random only after startGame (hitRandomTarget path).
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import {
  startGame,
  submitAnswer,
} from '../../src/games/fraction-pinball/rules';

afterEach(() => vi.restoreAllMocks());

describe('Wave 42 pinball — submit phase leftovers', () => {
  it('showResult submit is identity', () => {
    let state = startGame(createInitialState());
    state = submitAnswer(state, state.currentChallenge!.correctAnswer);
    expect(state.phase).toBe('showResult');
    expect(submitAnswer(state, 'anything')).toBe(state);
  });

  it('correct submit sets isCorrect and selectedAnswer', () => {
    const state = startGame(createInitialState());
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const ans = state.currentChallenge!.correctAnswer;
    const next = submitAnswer(state, ans);
    expect(next.isCorrect).toBe(true);
    expect(next.selectedAnswer).toBe(ans);
    expect(next.phase).toBe('showResult');
    expect(next.player1Stats.correctAnswers).toBe(1);
    expect(next.player1Stats.score).toBeGreaterThan(0);
  });

  it('wrong submit drains ball without score bump', () => {
    const state = startGame(createInitialState());
    const wrong = state.currentChallenge!.answerChoices.find(
      (c) => c !== state.currentChallenge!.correctAnswer
    )!;
    const next = submitAnswer(state, wrong);
    expect(next.isCorrect).toBe(false);
    expect(next.player1Stats.wrongAnswers).toBe(1);
    expect(next.player1Stats.ballsRemaining).toBe(
      state.player1Stats.ballsRemaining - 1
    );
    expect(next.player1Stats.score).toBe(state.player1Stats.score);
  });
});
