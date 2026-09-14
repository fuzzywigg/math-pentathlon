/**
 * Overnight TOKENMAXX HEAVY leftover — Frac Fact SVG size matrix (large operands / medium choices).
 * Distinct from wave50 whole-number path. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import {
  renderProblem,
  renderAnswerChoices,
} from '../../src/games/frac-fact/board-ui';

describe('Wave 54 frac board-ui — SVG size matrix', () => {
  it('operands use large 80x90 viewBox; choices use medium 60x70', () => {
    const state = {
      ...createInitialState('medium'),
      phase: 'playing' as const,
      currentProblem: {
        id: 'sizes',
        operand1: { numerator: 2, denominator: 5 },
        operand2: { numerator: 1, denominator: 5 },
        operation: 'subtract' as const,
        correctAnswer: { numerator: 1, denominator: 5 },
        answerChoices: [
          { numerator: 1, denominator: 5 },
          { numerator: 3, denominator: 5 },
        ],
      },
    };
    const problem = renderProblem(state);
    const opSvg = problem.querySelector('.frac-operand svg.fraction-svg');
    expect(opSvg?.getAttribute('width')).toBe('80');
    expect(opSvg?.getAttribute('height')).toBe('90');
    expect(opSvg?.getAttribute('viewBox')).toBe('0 0 80 90');
    expect(opSvg?.querySelectorAll('text').length).toBe(2);
    expect(opSvg?.querySelector('line')).toBeTruthy();
    expect(problem.querySelector('.frac-operation')?.textContent).toBe('−');

    const choices = renderAnswerChoices(state, () => undefined);
    const choiceSvg = choices.querySelector('svg.fraction-svg');
    expect(choiceSvg?.getAttribute('width')).toBe('60');
    expect(choiceSvg?.getAttribute('height')).toBe('70');
    expect(choiceSvg?.getAttribute('viewBox')).toBe('0 0 60 70');
  });
});
