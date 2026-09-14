/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Frac Fact Correct! exact + ✓ icon.
 * Wave50 matched /Correct!/ only. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { renderResult } from '../../src/games/frac-fact/board-ui';

describe('Wave 56 frac board — correct exact', () => {
  it('uses exact Correct! and ✓ leftover', () => {
    const el = renderResult(
      {
        ...createInitialState('easy'),
        phase: 'showingResult',
        isCorrect: true,
        selectedAnswer: { numerator: 1, denominator: 1 },
        currentProblem: {
          id: 'ok',
          operand1: { numerator: 1, denominator: 2 },
          operand2: { numerator: 1, denominator: 2 },
          operation: 'add',
          correctAnswer: { numerator: 1, denominator: 1 },
          answerChoices: [{ numerator: 1, denominator: 1 }],
        },
      },
      () => undefined
    );
    expect(el.querySelector('.frac-feedback-icon')?.textContent).toBe('✓');
    expect(el.querySelector('.frac-feedback-text')?.textContent).toBe('Correct!');
    expect(el.querySelector('.frac-feedback.correct')).toBeTruthy();
  });
});
