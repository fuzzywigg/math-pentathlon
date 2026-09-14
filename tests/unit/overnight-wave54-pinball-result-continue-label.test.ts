/**
 * Wave 54 leftover after #240 — Pinball continue button label. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { renderResult } from '../../src/games/fraction-pinball/board-ui';

describe('Wave 54 pinball — continue label', () => {
  it('labels the continue control Continue', () => {
    const el = renderResult(
      {
        ...createInitialState(),
        phase: 'showResult',
        isCorrect: true,
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
    expect(el.querySelector('.pinball-continue-btn')?.textContent).toBe(
      'Continue'
    );
  });
});
