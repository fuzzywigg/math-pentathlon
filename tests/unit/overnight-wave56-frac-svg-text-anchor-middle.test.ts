/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Frac Fact SVG text-anchor.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { renderProblem } from '../../src/games/frac-fact/board-ui';

describe('Wave 56 frac SVG — text-anchor middle', () => {
  it('operand texts use text-anchor middle leftover', () => {
    const el = renderProblem({
      ...createInitialState('easy'),
      currentProblem: {
        id: 'p',
        operand1: { numerator: 1, denominator: 2 },
        operand2: { numerator: 1, denominator: 3 },
        operation: 'add',
        correctAnswer: { numerator: 5, denominator: 6 },
        answerChoices: [{ numerator: 5, denominator: 6 }],
      },
    });
    const texts = el.querySelectorAll('.frac-operand text');
    expect(texts.length).toBeGreaterThan(0);
    for (const t of texts) {
      expect(t.getAttribute('text-anchor')).toBe('middle');
    }
  });
});
