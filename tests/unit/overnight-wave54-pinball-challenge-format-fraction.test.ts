/**
 * Wave 54 leftover after #240 — Pinball F→D formatted fraction. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { renderChallenge } from '../../src/games/fraction-pinball/board-ui';
import { formatFraction } from '../../src/games/fraction-pinball/rules';

describe('Wave 54 pinball — F→D formatted value', () => {
  it('shows formatFraction in the value node', () => {
    const fraction = { numerator: 2, denominator: 5 };
    const el = renderChallenge(
      {
        ...createInitialState(),
        currentChallenge: {
          id: 'c',
          type: 'fractionToDecimal',
          fraction,
          decimal: 0.4,
          answerChoices: [],
          correctAnswer: '0.4',
        },
      },
      () => undefined
    );
    expect(el.querySelector('.pinball-fraction')?.textContent).toBe(
      formatFraction(fraction)
    );
  });
});
