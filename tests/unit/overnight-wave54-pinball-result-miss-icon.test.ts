/**
 * Wave 54 leftover after #240 — Pinball miss icon + copy. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { renderResult } from '../../src/games/fraction-pinball/board-ui';

describe('Wave 54 pinball — miss icon', () => {
  it('uses ✗ and Miss copy', () => {
    const el = renderResult(
      {
        ...createInitialState(),
        phase: 'showResult',
        isCorrect: false,
        currentChallenge: {
          id: 'c',
          type: 'fractionToDecimal',
          fraction: { numerator: 1, denominator: 2 },
          decimal: 0.5,
          answerChoices: ['0.5'],
          correctAnswer: '0.5',
        },
      },
      () => undefined
    );
    expect(el.querySelector('.pinball-feedback-icon')?.textContent).toBe('✗');
    expect(el.querySelector('.pinball-feedback-text')?.textContent).toBe(
      'Miss! Ball lost.'
    );
  });
});
