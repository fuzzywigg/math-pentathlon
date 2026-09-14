/**
 * Overnight HEAVY leftover after #234 — Frac Fact problem op symbols +/−/÷.
 * Wave50 operands test only asserted ×. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { renderProblem } from '../../src/games/frac-fact/board-ui';

function problem(operation: 'add' | 'subtract' | 'divide') {
  return {
    ...createInitialState('medium'),
    currentProblem: {
      id: 'op',
      operand1: { numerator: 1, denominator: 2 },
      operand2: { numerator: 1, denominator: 3 },
      operation,
      correctAnswer: { numerator: 1, denominator: 6 },
      answerChoices: [{ numerator: 1, denominator: 6 }],
    },
  };
}

describe('Wave 52 frac — op symbols DOM', () => {
  it('renders +, −, and ÷ in .frac-operation', () => {
    expect(renderProblem(problem('add')).querySelector('.frac-operation')?.textContent).toBe('+');
    expect(renderProblem(problem('subtract')).querySelector('.frac-operation')?.textContent).toBe('−');
    expect(renderProblem(problem('divide')).querySelector('.frac-operation')?.textContent).toBe('÷');
  });
});
