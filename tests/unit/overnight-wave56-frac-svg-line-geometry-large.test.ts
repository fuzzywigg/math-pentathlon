/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Frac Fact large fraction line geometry.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { renderProblem } from '../../src/games/frac-fact/board-ui';

describe('Wave 56 frac SVG — large line geometry', () => {
  it('large fraction line is x1=10 x2=70 y=45 leftover', () => {
    const el = renderProblem({
      ...createInitialState('easy'),
      currentProblem: {
        id: 'p',
        operand1: { numerator: 3, denominator: 4 },
        operand2: { numerator: 1, denominator: 4 },
        operation: 'subtract',
        correctAnswer: { numerator: 1, denominator: 2 },
        answerChoices: [{ numerator: 1, denominator: 2 }],
      },
    });
    const line = el.querySelector('.frac-operand line');
    expect(line?.getAttribute('x1')).toBe('10');
    expect(line?.getAttribute('x2')).toBe('70');
    expect(line?.getAttribute('y1')).toBe('45');
    expect(line?.getAttribute('y2')).toBe('45');
  });
});
