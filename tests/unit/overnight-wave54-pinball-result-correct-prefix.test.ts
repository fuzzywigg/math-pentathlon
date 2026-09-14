/**
 * Wave 54 leftover after #240 — Pinball miss Correct: prefix. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { renderResult } from '../../src/games/fraction-pinball/board-ui';

describe('Wave 54 pinball — miss correct prefix', () => {
  it('prefixes the answer with Correct:', () => {
    const el = renderResult(
      {
        ...createInitialState(),
        phase: 'showResult',
        isCorrect: false,
        currentChallenge: {
          id: 'c',
          type: 'decimalToFraction',
          fraction: { numerator: 3, denominator: 8 },
          decimal: 0.375,
          answerChoices: ['3/8'],
          correctAnswer: '3/8',
        },
      },
      () => undefined
    );
    expect(el.querySelector('.pinball-correct')?.textContent).toBe(
      'Correct: 3/8'
    );
  });
});
