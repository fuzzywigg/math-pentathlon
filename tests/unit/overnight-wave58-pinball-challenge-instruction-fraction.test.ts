/**
 * Overnight TOKENMAXX HEAVY leftovers after #272 — Pinball Convert to fraction instruction.
 * Deepen instruction copy leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { renderChallenge } from '../../src/games/fraction-pinball/board-ui';
import { createInitialState } from '../../src/games/fraction-pinball/types';

describe('Wave 58 pinball challenge — convert to fraction', () => {
  it('shows Convert to fraction instruction leftover', () => {
    const state = {
      ...createInitialState(),
      phase: 'answering' as const,
      currentChallenge: {
        id: 'c2',
        type: 'decimalToFraction' as const,
        fraction: { numerator: 1, denominator: 4 },
        decimal: 0.25,
        answerChoices: ['1/4', '1/2', '3/4', '1/5'],
        correctAnswer: '1/4',
      },
    };
    const el = renderChallenge(state, () => {});
    expect(el.querySelector('.pinball-instruction')?.textContent).toBe(
      'Convert to fraction:'
    );
  });
});
