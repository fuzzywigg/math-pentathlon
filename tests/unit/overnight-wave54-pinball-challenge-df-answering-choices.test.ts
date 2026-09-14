/**
 * Wave 54 leftover after #240 — Pinball D→F answering choices. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { renderChallenge } from '../../src/games/fraction-pinball/board-ui';

describe('Wave 54 pinball — D→F answering choices', () => {
  it('shows choice grid in answering for decimalToFraction', () => {
    const el = renderChallenge(
      {
        ...createInitialState(),
        phase: 'answering',
        currentChallenge: {
          id: 'c',
          type: 'decimalToFraction',
          fraction: { numerator: 1, denominator: 5 },
          decimal: 0.2,
          answerChoices: ['1/5', '1/4', '1/2', '2/5'],
          correctAnswer: '1/5',
        },
      },
      () => undefined
    );
    expect(el.querySelector('.pinball-choices')).toBeTruthy();
    expect(el.querySelectorAll('.pinball-choice-btn').length).toBe(4);
  });
});
