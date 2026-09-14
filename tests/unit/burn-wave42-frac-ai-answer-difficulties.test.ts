/**
 * Wave 42 — Frac-Fact AI answer across difficulties (leftover). Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getAIAnswer, isAITurn } from '../../src/games/frac-fact/ai';
import { createInitialState } from '../../src/games/frac-fact/types';
import {
  startGame,
  checkAnswer,
  submitAnswer,
} from '../../src/games/frac-fact/rules';

describe('Wave 42 frac-fact — AI answers', () => {
  it('hard usually correct; answer in choices', () => {
    let correct = 0;
    for (let i = 0; i < 20; i++) {
      const state = startGame(createInitialState('hard'));
      const ans = getAIAnswer(state, 'player1', 'hard');
      expect(ans).not.toBeNull();
      expect(
        state.currentProblem!.answerChoices.some(
          (c) =>
            c.numerator === ans!.numerator &&
            c.denominator === ans!.denominator
        )
      ).toBe(true);
      if (checkAnswer(state.currentProblem!, ans!)) correct++;
    }
    expect(correct).toBeGreaterThan(10);
  });

  it('easy may miss; isAITurn gates', () => {
    const state = startGame(createInitialState('easy'));
    expect(isAITurn(state, 'player1')).toBe(true);
    expect(isAITurn(state, 'player2')).toBe(false);
    const ans = getAIAnswer(state, 'player1', 'easy');
    expect(ans).not.toBeNull();
    const submitted = submitAnswer(state, ans!);
    expect(submitted.phase).toBe('showingResult');
  });

  it('no problem → null AI', () => {
    const open = createInitialState('medium');
    expect(getAIAnswer(open, 'player1', 'medium')).toBeNull();
  });
});
