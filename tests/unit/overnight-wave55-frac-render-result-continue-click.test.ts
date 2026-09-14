/**
 * Overnight TOKENMAXX HEAVY leftovers after #250 — Frac Fact result Continue click.
 * Tests-only.
 */
import { describe, it, expect, vi } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { renderResult } from '../../src/games/frac-fact/board-ui';

describe('Wave 55 frac board — continue click', () => {
  it('Continue button invokes onContinue', () => {
    const onContinue = vi.fn();
    const el = renderResult(
      {
        ...createInitialState('easy'),
        phase: 'showingResult',
        isCorrect: true,
        selectedAnswer: { numerator: 1, denominator: 1 },
        currentProblem: {
          id: 'c',
          operand1: { numerator: 1, denominator: 2 },
          operand2: { numerator: 1, denominator: 2 },
          operation: 'add',
          correctAnswer: { numerator: 1, denominator: 1 },
          answerChoices: [{ numerator: 1, denominator: 1 }],
        },
      },
      onContinue
    );
    const btn = el.querySelector('.frac-continue-btn') as HTMLButtonElement;
    expect(btn.textContent).toBe('Continue');
    btn.click();
    expect(onContinue).toHaveBeenCalledTimes(1);
  });
});
