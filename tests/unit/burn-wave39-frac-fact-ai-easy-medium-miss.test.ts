/**
 * Wave 39 — Frac Fact AI easy/medium miss paths leftovers.
 * Tests-only. Do not pin Math.random before generateProblem (distractor fill).
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { startGame } from '../../src/games/frac-fact/rules';
import { getAIAnswer, isAITurn } from '../../src/games/frac-fact/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 39 Frac Fact — AI easy/medium', () => {
  it('hard prefers correct when accuracy triggers', () => {
    const state = startGame(createInitialState('hard'));
    vi.spyOn(Math, 'random').mockReturnValue(0); // after generate
    const ans = getAIAnswer(state, 'player1', 'hard');
    expect(ans).toEqual(state.currentProblem!.correctAnswer);
  });

  it('easy can miss when teaching random triggers', () => {
    const state = startGame(createInitialState('easy'));
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const ans = getAIAnswer(state, 'player1', 'easy');
    expect(ans).not.toBeNull();
    const choices = state.currentProblem!.answerChoices;
    expect(
      choices.some(
        (c) =>
          c.numerator === ans!.numerator && c.denominator === ans!.denominator
      )
    ).toBe(true);
  });

  it('medium returns a choice from answerChoices', () => {
    const state = startGame(createInitialState('medium'));
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const ans = getAIAnswer(state, 'player1', 'medium');
    expect(ans).not.toBeNull();
    expect(
      state.currentProblem!.answerChoices.some(
        (c) =>
          c.numerator === ans!.numerator && c.denominator === ans!.denominator
      )
    ).toBe(true);
  });

  it('isAITurn true for matching playing seat', () => {
    const state = startGame(createInitialState());
    expect(isAITurn(state, 'player1')).toBe(true);
    expect(isAITurn({ ...state, phase: 'showingResult' }, 'player1')).toBe(
      false
    );
  });
});
