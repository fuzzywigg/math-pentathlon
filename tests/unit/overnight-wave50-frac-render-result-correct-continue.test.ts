/**
 * Overnight HEAVY leftover after #229 — Frac Fact correct result + continue. Tests-only.
 */
import { describe, it, expect, vi } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { renderResult } from '../../src/games/frac-fact/board-ui';

describe('Wave 50 frac — result correct', () => {
  it('shows Correct! and Continue invokes callback', () => {
    const onContinue = vi.fn();
    const state = {
      ...createInitialState('easy'),
      phase: 'showingResult' as const,
      isCorrect: true,
      currentProblem: {
        id: 'ok',
        operand1: { numerator: 1, denominator: 2 },
        operand2: { numerator: 1, denominator: 2 },
        operation: 'add' as const,
        correctAnswer: { numerator: 1, denominator: 1 },
        answerChoices: [{ numerator: 1, denominator: 1 }],
      },
    };
    const el = renderResult(state, onContinue);
    expect(el.querySelector('.frac-feedback.correct')?.textContent).toMatch(/Correct!/);
    (el.querySelector('.frac-continue-btn') as HTMLButtonElement).click();
    expect(onContinue).toHaveBeenCalledTimes(1);
  });
});
