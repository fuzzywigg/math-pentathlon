/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Frac Fact incorrect feedback icon.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { renderResult } from '../../src/games/frac-fact/board-ui';

describe('Wave 56 frac board — incorrect x icon', () => {
  it('renders exact ✗ in feedback icon leftover', () => {
    const el = renderResult(
      {
        ...createInitialState('easy'),
        phase: 'showingResult',
        isCorrect: false,
        selectedAnswer: { numerator: 1, denominator: 3 },
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
    expect(el.querySelector('.frac-feedback-icon')?.textContent).toBe('✗');
  });
});
