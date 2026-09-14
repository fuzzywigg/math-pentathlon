/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Frac Fact incorrect copy exact.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { renderResult } from '../../src/games/frac-fact/board-ui';

describe('Wave 56 frac board — incorrect exact copy', () => {
  it('feedback text is exact Incorrect leftover', () => {
    const el = renderResult(
      {
        ...createInitialState('easy'),
        phase: 'showingResult',
        isCorrect: false,
        selectedAnswer: { numerator: 2, denominator: 3 },
        currentProblem: {
          id: 'p',
          operand1: { numerator: 1, denominator: 4 },
          operand2: { numerator: 1, denominator: 4 },
          operation: 'add',
          correctAnswer: { numerator: 1, denominator: 2 },
          answerChoices: [{ numerator: 1, denominator: 2 }],
        },
      },
      () => undefined
    );
    expect(el.querySelector('.frac-feedback-text')?.textContent).toBe(
      'Incorrect. The answer is:'
    );
  });
});
