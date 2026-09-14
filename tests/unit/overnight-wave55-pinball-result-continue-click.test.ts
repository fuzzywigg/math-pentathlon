/**
 * Overnight TOKENMAXX HEAVY leftovers after #250 — Pinball result Continue click leftover.
 * Tests-only.
 */
import { describe, it, expect, vi } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { renderResult } from '../../src/games/fraction-pinball/board-ui';

describe('Wave 55 pinball board — continue click', () => {
  it('Continue invokes onContinue leftover', () => {
    const onContinue = vi.fn();
    const el = renderResult(
      {
        ...createInitialState(),
        phase: 'showResult',
        isCorrect: false,
        currentChallenge: {
          id: 'c',
          type: 'fractionToDecimal',
          fraction: { numerator: 1, denominator: 2 },
          decimal: 0.5,
          answerChoices: ['0.5'],
          correctAnswer: '0.5',
        },
      },
      onContinue
    );
    const btn = el.querySelector('.pinball-continue-btn') as HTMLButtonElement;
    expect(btn.textContent).toBe('Continue');
    btn.click();
    expect(onContinue).toHaveBeenCalledTimes(1);
  });
});
