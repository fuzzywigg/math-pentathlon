/**
 * Wave 42 — Fraction Pinball player2 submit + getPlayerStats.
 * Tests-only. Mock Math.random only after startGame.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  createInitialState,
  getPlayerStats,
} from '../../src/games/fraction-pinball/types';
import {
  startGame,
  submitAnswer,
} from '../../src/games/fraction-pinball/rules';

afterEach(() => vi.restoreAllMocks());

describe('Wave 42 pinball — player2 submit stats', () => {
  it('player2 correct bumps only player2 stats', () => {
    let state = startGame(createInitialState());
    state = {
      ...state,
      currentPlayer: 'player2',
    };
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const ans = state.currentChallenge!.correctAnswer;
    const next = submitAnswer(state, ans);
    expect(getPlayerStats(next, 'player2').correctAnswers).toBe(1);
    expect(getPlayerStats(next, 'player2').score).toBeGreaterThan(0);
    expect(getPlayerStats(next, 'player1').correctAnswers).toBe(0);
    expect(getPlayerStats(next, 'player1').score).toBe(0);
  });

  it('player2 wrong drains only player2 balls', () => {
    let state = startGame(createInitialState());
    state = { ...state, currentPlayer: 'player2' };
    const wrong = state.currentChallenge!.answerChoices.find(
      (c) => c !== state.currentChallenge!.correctAnswer
    )!;
    const next = submitAnswer(state, wrong);
    expect(getPlayerStats(next, 'player2').ballsRemaining).toBe(
      state.player2Stats.ballsRemaining - 1
    );
    expect(getPlayerStats(next, 'player1').ballsRemaining).toBe(
      state.player1Stats.ballsRemaining
    );
  });
});
