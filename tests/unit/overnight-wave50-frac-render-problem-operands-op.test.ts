/**
 * Overnight HEAVY leftover after #229 — Frac Fact problem operands + op. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { renderProblem } from '../../src/games/frac-fact/board-ui';

describe('Wave 50 frac — problem display', () => {
  it('renders large SVGs, multiply symbol, equals, and ? box', () => {
    const state = {
      ...createInitialState('medium'),
      currentProblem: {
        id: 'p1',
        operand1: { numerator: 1, denominator: 2 },
        operand2: { numerator: 1, denominator: 3 },
        operation: 'multiply' as const,
        correctAnswer: { numerator: 1, denominator: 6 },
        answerChoices: [{ numerator: 1, denominator: 6 }],
      },
    };
    const el = renderProblem(state);
    expect(el.querySelectorAll('.frac-operand svg.fraction-svg').length).toBe(2);
    expect(el.querySelector('.frac-operation')?.textContent).toBe('×');
    expect(el.querySelector('.frac-equals')?.textContent).toBe('=');
    expect(el.querySelector('.frac-answer-box')?.textContent).toBe('?');
  });
});
