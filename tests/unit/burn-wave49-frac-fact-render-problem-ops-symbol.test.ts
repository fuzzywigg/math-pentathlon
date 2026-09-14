/**
 * Wave 49 — Frac-fact operation symbols in problem. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { renderProblem } from '../../src/games/frac-fact/board-ui';
import type { FractionOperation } from '../../src/core/fractions/types';

describe('Wave 49 frac-fact — op symbols', () => {
  it.each([
    ['add', '+'],
    ['subtract', '−'],
    ['multiply', '×'],
    ['divide', '÷'],
  ] as [FractionOperation, string][])('%s shows %s', (operation, symbol) => {
    const problem = {
      id: 'p',
      operand1: { numerator: 1, denominator: 2 },
      operand2: { numerator: 1, denominator: 4 },
      operation,
      correctAnswer: { numerator: 1, denominator: 1 },
      answerChoices: [{ numerator: 1, denominator: 1 }],
    };
    const el = renderProblem({ ...createInitialState(), currentProblem: problem });
    expect(el.querySelector('.frac-operation')?.textContent).toBe(symbol);
  });
});
