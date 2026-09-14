/**
 * Wave 54 leftover after #240 — Pinball D→F instruction copy. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { renderChallenge } from '../../src/games/fraction-pinball/board-ui';

describe('Wave 54 pinball — D→F instruction', () => {
  it('uses exact Convert to fraction copy', () => {
    const el = renderChallenge(
      {
        ...createInitialState(),
        currentChallenge: {
          id: 'c',
          type: 'decimalToFraction',
          fraction: { numerator: 1, denominator: 4 },
          decimal: 0.25,
          answerChoices: ['1/4'],
          correctAnswer: '1/4',
        },
      },
      () => undefined
    );
    expect(el.querySelector('.pinball-instruction')?.textContent).toBe(
      'Convert to fraction:'
    );
  });
});
