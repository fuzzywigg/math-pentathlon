/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Frac Fact correct feedback icon.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { renderResult } from '../../src/games/frac-fact/board-ui';

describe('Wave 56 frac board — correct check icon', () => {
  it('renders exact ✓ in feedback icon leftover', () => {
    const el = renderResult(
      {
        ...createInitialState('easy'),
        phase: 'showingResult',
        isCorrect: true,
        selectedAnswer: { numerator: 1, denominator: 1 },
        currentProblem: {
          id: 'p',
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
  });
});
