/**
 * Overnight TOKENMAXX HEAVY leftovers after #272 — Frac Fact answer-box.correct DOM.
 * Deepen selector presence on showingResult+correct. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { renderProblem } from '../../src/games/frac-fact/board-ui';
import { startGame, submitAnswer } from '../../src/games/frac-fact/rules';

describe('Wave 58 frac board — answer-box correct DOM', () => {
  it('querySelector .frac-answer-box.correct truthy leftover', () => {
    let state = startGame(createInitialState('easy'));
    const correct = state.currentProblem!.correctAnswer;
    state = submitAnswer(state, correct);
    const el = renderProblem(state);
    expect(el.querySelector('.frac-answer-box.correct')).toBeTruthy();
  });
});
