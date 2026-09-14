/**
 * Wave 42 — Fraction Pinball AI difficulty / isAITurn leftovers.
 * Beyond wave41 hard accuracy hit. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { startGame } from '../../src/games/fraction-pinball/rules';
import { getAIAnswer, isAITurn } from '../../src/games/fraction-pinball/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 42 pinball — AI difficulty leftovers', () => {
  it('hard accuracy miss returns a wrong listed choice', () => {
    const state = startGame(createInitialState());
    // accuracy 0.92 → random >= 0.92 misses
    vi.spyOn(Math, 'random').mockReturnValue(0.95);
    const ans = getAIAnswer(state, 'player1', 'hard');
    expect(ans).not.toBeNull();
    expect(state.currentChallenge!.answerChoices).toContain(ans!);
    expect(ans).not.toBe(state.currentChallenge!.correctAnswer);
  });

  it('easy returns a listed choice under teaching seed', () => {
    const state = startGame(createInitialState());
    vi.spyOn(Math, 'random').mockReturnValue(0.1);
    const ans = getAIAnswer(state, 'player1', 'easy');
    expect(ans).not.toBeNull();
    expect(state.currentChallenge!.answerChoices).toContain(ans!);
  });

  it('isAITurn gates phase and seat', () => {
    const state = startGame(createInitialState());
    expect(isAITurn(state, 'player1')).toBe(true);
    expect(isAITurn(state, 'player2')).toBe(false);
    expect(isAITurn(state, null)).toBe(false);
    expect(
      isAITurn({ ...state, phase: 'showResult', isCorrect: true }, 'player1')
    ).toBe(false);
  });
});
