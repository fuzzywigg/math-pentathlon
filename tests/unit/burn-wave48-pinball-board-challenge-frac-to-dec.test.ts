/**
 * Wave 48 — Pinball renderChallenge fractionToDecimal + choices. Tests-only.
 */
import { describe, it, expect, vi } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { renderChallenge } from '../../src/games/fraction-pinball/board-ui';

describe('Wave 48 pinball — challenge F→D', () => {
  it('renders fraction prompt and choice buttons', () => {
    const onSelect = vi.fn();
    const s = {
      ...createInitialState(),
      phase: 'answering' as const,
      currentChallenge: {
        id: 'c1',
        type: 'fractionToDecimal' as const,
        fraction: { numerator: 1, denominator: 2 },
        decimal: 0.5,
        answerChoices: ['0.5', '0.25', '0.75', '1'],
        correctAnswer: '0.5',
      },
    };
    const el = renderChallenge(s, onSelect);
    expect(el.textContent).toMatch(/decimal/i);
    expect(el.querySelectorAll('.pinball-choice-btn').length).toBe(4);
    (el.querySelector('.pinball-choice-btn') as HTMLElement).click();
    expect(onSelect).toHaveBeenCalledWith('0.5');
  });
});
