/**
 * Wave 54 leftover after #240 — Pinball F→D instruction copy. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { renderChallenge } from '../../src/games/fraction-pinball/board-ui';

describe('Wave 54 pinball — F→D instruction', () => {
  it('uses exact Convert to decimal copy', () => {
    const el = renderChallenge(
      {
        ...createInitialState(),
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
    expect(el.querySelector('.pinball-instruction')?.textContent).toBe(
      'Convert to decimal:'
    );
  });
});
