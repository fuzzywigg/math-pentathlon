/**
 * Overnight TOKENMAXX HEAVY leftovers after #250 — Pinball challenge showResult hides choices.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { renderChallenge } from '../../src/games/fraction-pinball/board-ui';

describe('Wave 55 pinball board — showResult hides choices', () => {
  it('keeps instruction but omits choice buttons leftover', () => {
    const el = renderChallenge(
      {
        ...createInitialState(),
        phase: 'showResult',
        currentChallenge: {
          id: 'c',
          type: 'fractionToDecimal',
          fraction: { numerator: 1, denominator: 4 },
          decimal: 0.25,
          answerChoices: ['0.25', '0.5'],
          correctAnswer: '0.25',
        },
      },
      () => undefined
    );
    expect(el.querySelector('.pinball-instruction')?.textContent).toMatch(
      /Convert to decimal/
    );
    expect(el.querySelectorAll('.pinball-choice-btn').length).toBe(0);
  });
});
