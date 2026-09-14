/**
 * Overnight TOKENMAXX HEAVY leftover — Frac Fact renderResult empty on gameOver.
 * Wave50 only gated playing. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import {
  renderResult,
  renderAnswerChoices,
} from '../../src/games/frac-fact/board-ui';

describe('Wave 54 frac board-ui — gameOver empty result/choices', () => {
  it('gameOver with leftover problem does not mount feedback or choice buttons', () => {
    const state = {
      ...createInitialState('easy'),
      phase: 'gameOver' as const,
      winner: 'player1' as const,
      currentProblem: {
        id: 'stale',
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
    const result = renderResult(state, () => undefined);
    expect(result.classList.contains('frac-result')).toBe(true);
    expect(result.querySelector('.frac-feedback')).toBeNull();
    expect(result.querySelector('.frac-continue-btn')).toBeNull();
    expect(
      renderAnswerChoices(state, () => undefined).querySelectorAll('button')
        .length
    ).toBe(0);
  });
});
