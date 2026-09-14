/**
 * Overnight HEAVY leftover after #229 — Frac Fact answer box correct/incorrect. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { renderProblem } from '../../src/games/frac-fact/board-ui';

function problemState(correct: boolean) {
  return {
    ...createInitialState('easy'),
    phase: 'showingResult' as const,
    isCorrect: correct,
    selectedAnswer: { numerator: 1, denominator: 1 },
    currentProblem: {
      id: 'r1',
      operand1: { numerator: 1, denominator: 2 },
      operand2: { numerator: 1, denominator: 2 },
      operation: 'add' as const,
      correctAnswer: { numerator: 1, denominator: 1 },
      answerChoices: [{ numerator: 1, denominator: 1 }],
    },
  };
}

describe('Wave 50 frac — answer box result', () => {
  it('shows selected SVG with correct/incorrect class', () => {
    const ok = renderProblem(problemState(true)).querySelector('.frac-answer-box');
    expect(ok?.classList.contains('correct')).toBe(true);
    expect(ok?.querySelector('svg.fraction-svg')).toBeTruthy();
    const bad = renderProblem(problemState(false)).querySelector('.frac-answer-box');
    expect(bad?.classList.contains('incorrect')).toBe(true);
  });
});
