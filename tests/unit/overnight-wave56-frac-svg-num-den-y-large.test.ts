/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Frac Fact large num/den Y positions.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { renderProblem } from '../../src/games/frac-fact/board-ui';

describe('Wave 56 frac SVG — num/den Y large', () => {
  it('numerator y=37 and denominator y=79 leftover', () => {
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
    const texts = el.querySelectorAll('.frac-operand:first-child text');
    expect(texts[0]?.getAttribute('y')).toBe('37');
    expect(texts[1]?.getAttribute('y')).toBe('79');
  });
});
