/**
 * Overnight HEAVY leftover after #229 — Frac Fact whole-number SVG path. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { renderProblem } from '../../src/games/frac-fact/board-ui';

describe('Wave 50 frac — whole number svg', () => {
  it('denominator 1 renders single text node without fraction line', () => {
    const state = {
      ...createInitialState('easy'),
      currentProblem: {
        id: 'w1',
        operand1: { numerator: 3, denominator: 1 },
        operand2: { numerator: 2, denominator: 1 },
        operation: 'add' as const,
        correctAnswer: { numerator: 5, denominator: 1 },
        answerChoices: [{ numerator: 5, denominator: 1 }],
      },
    };
    const el = renderProblem(state);
    const svg = el.querySelector('.frac-operand svg.fraction-svg');
    expect(svg?.querySelectorAll('text').length).toBe(1);
    expect(svg?.querySelector('text')?.textContent).toBe('3');
    expect(svg?.querySelector('line')).toBeNull();
  });
});
