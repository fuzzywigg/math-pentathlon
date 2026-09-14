/**
 * Wave 54 leftover after #240 — Pinball choice click forwards raw label. Tests-only.
 */
import { describe, it, expect, vi } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { renderChallenge } from '../../src/games/fraction-pinball/board-ui';

describe('Wave 54 pinball — choice click second', () => {
  it('forwards the second choice string', () => {
    const onSelect = vi.fn();
    const el = renderChallenge(
      {
        ...createInitialState(),
        phase: 'answering',
        currentChallenge: {
          id: 'c',
          type: 'fractionToDecimal',
          fraction: { numerator: 1, denominator: 2 },
          decimal: 0.5,
          answerChoices: ['0.5', '0.25', '0.75'],
          correctAnswer: '0.5',
        },
      },
      onSelect
    );
    const btns = el.querySelectorAll('.pinball-choice-btn');
    expect(btns.length).toBe(3);
    (btns[1] as HTMLElement).click();
    expect(onSelect).toHaveBeenCalledWith('0.25');
  });
});
