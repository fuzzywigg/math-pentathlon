/**
 * Overnight TOKENMAXX HEAVY leftovers after #250 — Frac Fact fraction SVG line stroke leftover.
 * Wave54 sampled viewBox/text count. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { renderProblem } from '../../src/games/frac-fact/board-ui';

describe('Wave 55 frac board — fraction line stroke', () => {
  it('operand SVG uses stroke-width 2 and fill #333', () => {
    const el = renderProblem({
      ...createInitialState('medium'),
      currentProblem: {
        id: 'ln',
        operand1: { numerator: 3, denominator: 5 },
        operand2: { numerator: 1, denominator: 5 },
        operation: 'add',
        correctAnswer: { numerator: 4, denominator: 5 },
        answerChoices: [{ numerator: 4, denominator: 5 }],
      },
    });
    const svg = el.querySelector('.frac-operand svg.fraction-svg')!;
    expect(svg.querySelector('line')?.getAttribute('stroke-width')).toBe('2');
    expect(svg.querySelector('line')?.getAttribute('stroke')).toBe('#333');
    expect(svg.querySelector('text')?.getAttribute('fill')).toBe('#333');
    expect(svg.querySelector('text')?.getAttribute('font-weight')).toBe('bold');
  });
});
