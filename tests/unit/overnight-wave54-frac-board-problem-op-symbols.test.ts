/**
 * Overnight TOKENMAXX HEAVY leftover — Frac Fact renderProblem operation symbols catalog.
 * Wave50 only asserted multiply ×. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { renderProblem } from '../../src/games/frac-fact/board-ui';
import type { FractionOperation } from '../../src/core/fractions/types';

const SYMBOLS: Record<FractionOperation, string> = {
  add: '+',
  subtract: '−',
  multiply: '×',
  divide: '÷',
};

describe('Wave 54 frac board-ui — problem op symbols', () => {
  it('maps add/subtract/divide (and multiply) into .frac-operation', () => {
    for (const op of Object.keys(SYMBOLS) as FractionOperation[]) {
      const el = renderProblem({
        ...createInitialState('hard'),
        currentProblem: {
          id: `op-${op}`,
          operand1: { numerator: 1, denominator: 2 },
          operand2: { numerator: 1, denominator: 4 },
          operation: op,
          correctAnswer: { numerator: 1, denominator: 1 },
          answerChoices: [{ numerator: 1, denominator: 1 }],
        },
      });
      expect(el.querySelector('.frac-operation')?.textContent).toBe(SYMBOLS[op]);
    }
  });
});
