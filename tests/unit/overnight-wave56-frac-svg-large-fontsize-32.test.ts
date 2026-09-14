/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Frac Fact large SVG font-size 32.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { renderProblem } from '../../src/games/frac-fact/board-ui';

describe('Wave 56 frac SVG — large font-size', () => {
  it('problem operand SVG uses font-size 32 leftover', () => {
    const el = renderProblem({
      ...createInitialState('easy'),
      currentProblem: {
        id: 'p',
        operand1: { numerator: 2, denominator: 5 },
        operand2: { numerator: 1, denominator: 5 },
        operation: 'add',
        correctAnswer: { numerator: 3, denominator: 5 },
        answerChoices: [{ numerator: 3, denominator: 5 }],
      },
    });
    const text = el.querySelector('.frac-operand text');
    expect(text?.getAttribute('font-size')).toBe('32');
  });
});
