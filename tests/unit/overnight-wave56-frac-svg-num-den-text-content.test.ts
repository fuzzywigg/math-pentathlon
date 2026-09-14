/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Frac Fact SVG num/den text content.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { renderProblem } from '../../src/games/frac-fact/board-ui';

describe('Wave 56 frac SVG — num/den content', () => {
  it('operand texts are 3 then 5 leftover', () => {
    const el = renderProblem({
      ...createInitialState('easy'),
      currentProblem: {
        id: 'p',
        operand1: { numerator: 3, denominator: 5 },
        operand2: { numerator: 1, denominator: 5 },
        operation: 'add',
        correctAnswer: { numerator: 4, denominator: 5 },
        answerChoices: [{ numerator: 4, denominator: 5 }],
      },
    });
    const texts = [...el.querySelectorAll('.frac-operand:first-child text')].map(
      (t) => t.textContent
    );
    expect(texts).toEqual(['3', '5']);
  });
});
