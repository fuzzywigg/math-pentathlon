/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Frac Fact incorrect feedback exact copy.
 * Wave50 only matched /Incorrect/. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { renderResult } from '../../src/games/frac-fact/board-ui';

describe('Wave 56 frac board — incorrect exact', () => {
  it('uses exact Incorrect. The answer is: + ✗ icon leftover', () => {
    const el = renderResult(
      {
        ...createInitialState('easy'),
        phase: 'showingResult',
        isCorrect: false,
        selectedAnswer: { numerator: 1, denominator: 2 },
        currentProblem: {
          id: 'bad',
          operand1: { numerator: 1, denominator: 2 },
          operand2: { numerator: 1, denominator: 3 },
          operation: 'subtract',
          correctAnswer: { numerator: 1, denominator: 6 },
          answerChoices: [{ numerator: 1, denominator: 6 }],
        },
      },
      () => undefined
    );
    expect(el.querySelector('.frac-feedback-icon')?.textContent).toBe('✗');
    expect(el.querySelector('.frac-feedback-text')?.textContent).toBe(
      'Incorrect. The answer is:'
    );
    expect(el.querySelector('.frac-correct-answer svg.fraction-svg')).toBeTruthy();
  });
});
