/**
 * Wave 42 — Fraction Pinball AI answers (leftover vs #187). Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getAIAnswer, isAITurn } from '../../src/games/fraction-pinball/ai';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import {
  startGame,
  checkAnswer,
  submitAnswer,
} from '../../src/games/fraction-pinball/rules';

describe('Wave 42 pinball — AI answer matrix', () => {
  it('hard mostly correct across challenges', () => {
    let hits = 0;
    for (let i = 0; i < 16; i++) {
      const state = startGame(createInitialState());
      const ans = getAIAnswer(state, 'player1', 'hard');
      expect(ans).not.toBeNull();
      expect(state.currentChallenge!.answerChoices).toContain(ans!);
      if (checkAnswer(state.currentChallenge!, ans!)) hits++;
    }
    expect(hits).toBeGreaterThan(8);
  });

  it('submit wrong drains ball; AI seat gate', () => {
    const state = startGame(createInitialState());
    expect(isAITurn(state, 'player1')).toBe(true);
    const wrong = state.currentChallenge!.answerChoices.find(
      (a) => a !== state.currentChallenge!.correctAnswer
    )!;
    const next = submitAnswer(state, wrong);
    expect(next.isCorrect).toBe(false);
    expect(next.player1Stats.ballsRemaining).toBe(
      state.player1Stats.ballsRemaining - 1
    );
    expect(next.phase).toBe('showResult');
  });

  it('null challenge → null AI', () => {
    expect(getAIAnswer(createInitialState(), 'player1', 'medium')).toBeNull();
  });
});
