/**
 * Wave 54 leftover after #240 — Pinball F→D value class. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { renderChallenge } from '../../src/games/fraction-pinball/board-ui';

describe('Wave 54 pinball — F→D fraction class', () => {
  it('marks value with pinball-fraction', () => {
    const el = renderChallenge(
      {
        ...createInitialState(),
        currentChallenge: {
          id: 'c',
          type: 'fractionToDecimal',
          fraction: { numerator: 3, denominator: 4 },
          decimal: 0.75,
          answerChoices: [],
          correctAnswer: '0.75',
        },
      },
      () => undefined
    );
    expect(el.querySelector('.pinball-value.pinball-fraction')).toBeTruthy();
  });
});
