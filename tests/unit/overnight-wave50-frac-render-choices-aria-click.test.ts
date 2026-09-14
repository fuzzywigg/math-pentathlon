/**
 * Overnight HEAVY leftover after #229 — Frac Fact choice aria + click. Tests-only.
 */
import { describe, it, expect, vi } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { renderAnswerChoices } from '../../src/games/frac-fact/board-ui';

describe('Wave 50 frac — choices aria/click', () => {
  it('renders aria-labeled buttons and invokes onSelect', () => {
    const choices = [
      { numerator: 1, denominator: 2 },
      { numerator: 2, denominator: 3 },
      { numerator: 3, denominator: 4 },
    ];
    const state = {
      ...createInitialState('medium'),
      phase: 'playing' as const,
      currentProblem: {
        id: 'c1',
        operand1: { numerator: 1, denominator: 4 },
        operand2: { numerator: 1, denominator: 4 },
        operation: 'add' as const,
        correctAnswer: { numerator: 1, denominator: 2 },
        answerChoices: choices,
      },
    };
    const onSelect = vi.fn();
    const el = renderAnswerChoices(state, onSelect);
    const buttons = el.querySelectorAll('.frac-choice-btn');
    expect(buttons.length).toBe(3);
    expect(buttons[0].getAttribute('aria-label')).toBe('Answer 1/2');
    expect(buttons[0].querySelector('svg.fraction-svg')).toBeTruthy();
    (buttons[1] as HTMLButtonElement).click();
    expect(onSelect).toHaveBeenCalledWith(choices[1]);
  });
});
