/**
 * Wave 54 leftover after #240 — Pinball D→F decimal class + format. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { renderChallenge } from '../../src/games/fraction-pinball/board-ui';
import { formatDecimal } from '../../src/games/fraction-pinball/rules';

describe('Wave 54 pinball — D→F decimal class', () => {
  it('marks value with pinball-decimal and formatted number', () => {
    const el = renderChallenge(
      {
        ...createInitialState(),
        currentChallenge: {
          id: 'c',
          type: 'decimalToFraction',
          fraction: { numerator: 1, denominator: 8 },
          decimal: 0.125,
          answerChoices: [],
          correctAnswer: '1/8',
        },
      },
      () => undefined
    );
    const val = el.querySelector('.pinball-value.pinball-decimal');
    expect(val).toBeTruthy();
    expect(val?.textContent).toBe(formatDecimal(0.125));
  });
});
