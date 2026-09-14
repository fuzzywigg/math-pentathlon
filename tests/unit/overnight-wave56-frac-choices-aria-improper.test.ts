/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Frac Fact choice aria-label leftover.
 * Wave50 covered 1/2; improper denom leftover. Tests-only.
 */
import { describe, it, expect, vi } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { renderAnswerChoices } from '../../src/games/frac-fact/board-ui';

describe('Wave 56 frac board — choice aria', () => {
  it('aria-label Answer n/d leftover for improper choice', () => {
    const onSelect = vi.fn();
    const el = renderAnswerChoices(
      {
        ...createInitialState('hard'),
        phase: 'playing',
        currentProblem: {
          id: 'aria',
          operand1: { numerator: 2, denominator: 3 },
          operand2: { numerator: 3, denominator: 4 },
          operation: 'multiply',
          correctAnswer: { numerator: 1, denominator: 2 },
          answerChoices: [
            { numerator: 5, denominator: 3 },
            { numerator: 1, denominator: 2 },
            { numerator: 7, denominator: 8 },
            { numerator: 0, denominator: 1 },
          ],
        },
      },
      onSelect
    );
    const buttons = el.querySelectorAll('.frac-choice-btn');
    expect(buttons).toHaveLength(4);
    expect(buttons[0].getAttribute('aria-label')).toBe('Answer 5/3');
    expect(buttons[3].getAttribute('aria-label')).toBe('Answer 0/1');
    (buttons[1] as HTMLButtonElement).click();
    expect(onSelect).toHaveBeenCalledWith({ numerator: 1, denominator: 2 });
  });
});
