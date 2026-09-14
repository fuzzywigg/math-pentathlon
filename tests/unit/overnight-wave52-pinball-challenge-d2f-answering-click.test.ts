/**
 * Overnight HEAVY leftover after #234 — Pinball D→F answering + choice click.
 * Wave48 D→F only covered showResult (no choices). Tests-only.
 */
import { describe, it, expect, vi } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { renderChallenge } from '../../src/games/fraction-pinball/board-ui';

describe('Wave 52 pinball — D→F answering', () => {
  it('shows decimal prompt, four choices, and invokes onAnswerSelect', () => {
    const onSelect = vi.fn();
    const state = {
      ...createInitialState(),
      phase: 'answering' as const,
      currentChallenge: {
        id: 'd2f',
        type: 'decimalToFraction' as const,
        fraction: { numerator: 1, denominator: 2 },
        decimal: 0.5,
        answerChoices: ['1/2', '1/4', '2/3', '3/4'],
        correctAnswer: '1/2',
      },
    };
    const el = renderChallenge(state, onSelect);
    expect(el.querySelector('.pinball-instruction')?.textContent).toMatch(/fraction/i);
    expect(el.querySelector('.pinball-decimal')?.textContent).toBe('0.5');
    const btns = el.querySelectorAll('.pinball-choice-btn');
    expect(btns).toHaveLength(4);
    (btns[0] as HTMLElement).click();
    expect(onSelect).toHaveBeenCalledWith('1/2');
  });
});
