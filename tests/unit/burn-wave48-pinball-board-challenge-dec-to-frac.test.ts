/**
 * Wave 48 — Pinball renderChallenge decimalToFraction. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { renderChallenge } from '../../src/games/fraction-pinball/board-ui';

describe('Wave 48 pinball — challenge D→F', () => {
  it('renders decimal prompt without choices outside answering', () => {
    const s = {
      ...createInitialState(),
      phase: 'showResult' as const,
      currentChallenge: {
        id: 'c2',
        type: 'decimalToFraction' as const,
        fraction: { numerator: 1, denominator: 4 },
        decimal: 0.25,
        answerChoices: ['1/4', '1/2'],
        correctAnswer: '1/4',
      },
    };
    const el = renderChallenge(s, () => undefined);
    expect(el.textContent).toMatch(/fraction/i);
    expect(el.querySelectorAll('.pinball-choice-btn').length).toBe(0);
  });
});
