/**
 * Overnight HEAVY leftover after #229 — Frac Fact choices phase gate. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { renderAnswerChoices } from '../../src/games/frac-fact/board-ui';

describe('Wave 50 frac — choices phase gate', () => {
  it('returns empty container when not playing or no problem', () => {
    const empty = renderAnswerChoices(createInitialState('easy'), () => undefined);
    expect(empty.classList.contains('frac-choices')).toBe(true);
    expect(empty.querySelectorAll('button').length).toBe(0);

    const showing = {
      ...createInitialState('easy'),
      phase: 'showingResult' as const,
      currentProblem: {
        id: 'x',
        operand1: { numerator: 1, denominator: 2 },
        operand2: { numerator: 1, denominator: 2 },
        operation: 'add' as const,
        correctAnswer: { numerator: 1, denominator: 1 },
        answerChoices: [
          { numerator: 1, denominator: 1 },
          { numerator: 1, denominator: 2 },
        ],
      },
    };
    expect(renderAnswerChoices(showing, () => undefined).querySelectorAll('button').length).toBe(0);
  });
});
