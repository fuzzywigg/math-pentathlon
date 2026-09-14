/**
 * Wave 39 — Fraction Pinball submitAnswer ball drain vs score.
 * Tests-only. Mock Math.random only after startGame.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  createInitialState,
  INITIAL_BALLS,
} from '../../src/games/fraction-pinball/types';
import {
  startGame,
  submitAnswer,
  checkAnswer,
} from '../../src/games/fraction-pinball/rules';

afterEach(() => vi.restoreAllMocks());

describe('Wave 39 Pinball — submit ball drain', () => {
  it('correct answer adds points without draining balls', () => {
    let state = startGame(createInitialState());
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const correct = state.currentChallenge!.correctAnswer;
    expect(checkAnswer(state.currentChallenge!, correct)).toBe(true);
    state = submitAnswer(state, correct);
    expect(state.isCorrect).toBe(true);
    expect(state.phase).toBe('showResult');
    expect(state.player1Stats.ballsRemaining).toBe(INITIAL_BALLS);
    expect(state.player1Stats.score).toBeGreaterThan(0);
    expect(state.player1Stats.correctAnswers).toBe(1);
  });

  it('wrong answer drains one ball and keeps score', () => {
    let state = startGame(createInitialState());
    state = submitAnswer(state, '__not_an_answer__');
    expect(state.isCorrect).toBe(false);
    expect(state.player1Stats.ballsRemaining).toBe(INITIAL_BALLS - 1);
    expect(state.player1Stats.wrongAnswers).toBe(1);
    expect(state.player1Stats.score).toBe(0);
  });

  it('submitAnswer identity when challenge null', () => {
    const state = {
      ...createInitialState(),
      phase: 'answering' as const,
      currentChallenge: null,
    };
    expect(submitAnswer(state, '0.5')).toBe(state);
  });
});
