/**
 * Overnight HEAVY leftover after #234 — Frac Fact large vs medium SVG sizes.
 * Wave50 checked structure/aria/click, not size attrs. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import {
  renderProblem,
  renderAnswerChoices,
} from '../../src/games/frac-fact/board-ui';

describe('Wave 52 frac — SVG size matrix', () => {
  it('problem operands are 80×90; choices are 60×70', () => {
    const state = {
      ...createInitialState('medium'),
      phase: 'playing' as const,
      currentProblem: {
        id: 'sz',
        operand1: { numerator: 1, denominator: 2 },
        operand2: { numerator: 1, denominator: 4 },
        operation: 'add' as const,
        correctAnswer: { numerator: 3, denominator: 4 },
        answerChoices: [
          { numerator: 3, denominator: 4 },
          { numerator: 1, denominator: 2 },
        ],
      },
    };
    const problemSvg = renderProblem(state).querySelector(
      '.frac-operand svg.fraction-svg'
    )!;
    expect(problemSvg.getAttribute('width')).toBe('80');
    expect(problemSvg.getAttribute('height')).toBe('90');
    const choiceSvg = renderAnswerChoices(state, () => undefined).querySelector(
      '.frac-choice-btn svg.fraction-svg'
    )!;
    expect(choiceSvg.getAttribute('width')).toBe('60');
    expect(choiceSvg.getAttribute('height')).toBe('70');
  });
});
