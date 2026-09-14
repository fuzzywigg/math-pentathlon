/**
 * Wave 54 leftover after #240 — Pinball hit feedback icon. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { renderResult } from '../../src/games/fraction-pinball/board-ui';

describe('Wave 54 pinball — hit icon', () => {
  it('uses 🎯 on correct', () => {
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
    expect(el.querySelector('.pinball-feedback-icon')?.textContent).toBe('🎯');
    expect(el.querySelector('.pinball-feedback-text')?.textContent).toBe(
      'HIT! Points scored!'
    );
  });
});
