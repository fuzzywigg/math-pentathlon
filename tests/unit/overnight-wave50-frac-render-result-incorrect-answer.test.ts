/**
 * Overnight HEAVY leftover after #229 — Frac Fact incorrect result shows answer. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { renderResult } from '../../src/games/frac-fact/board-ui';

describe('Wave 50 frac — result incorrect', () => {
  it('shows Incorrect copy and mounts correct-answer SVG', () => {
    const state = {
      ...createInitialState('easy'),
      phase: 'showingResult' as const,
      isCorrect: false,
      currentProblem: {
        id: 'bad',
        operand1: { numerator: 1, denominator: 2 },
        operand2: { numerator: 1, denominator: 3 },
        operation: 'subtract' as const,
        correctAnswer: { numerator: 1, denominator: 6 },
        answerChoices: [{ numerator: 1, denominator: 6 }],
      },
    };
    const el = renderResult(state, () => undefined);
    expect(el.querySelector('.frac-feedback.incorrect')?.textContent).toMatch(/Incorrect/);
    expect(el.querySelector('.frac-correct-answer svg.fraction-svg')).toBeTruthy();
  });
});
