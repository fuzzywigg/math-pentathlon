/**
 * Overnight TOKENMAXX HEAVY leftovers after #272 — Pinball Convert to decimal instruction.
 * Deepen instruction copy leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { renderChallenge } from '../../src/games/fraction-pinball/board-ui';
import { startGame } from '../../src/games/fraction-pinball/rules';

describe('Wave 58 pinball challenge — instruction copy', () => {
  it('shows Convert to decimal or fraction instruction leftover', () => {
    let state = startGame(createInitialState());
    // Force a known type by regenerating until fractionToDecimal if needed
    for (let i = 0; i < 20 && state.currentChallenge?.type !== 'fractionToDecimal'; i++) {
      state = startGame(createInitialState());
    }
    if (state.currentChallenge?.type !== 'fractionToDecimal') {
      state = {
        ...state,
        currentChallenge: {
          id: 'c1',
          type: 'fractionToDecimal',
          fraction: { numerator: 1, denominator: 2 },
          decimal: 0.5,
          answerChoices: ['0.5', '0.25', '0.75', '0.2'],
          correctAnswer: '0.5',
        },
        phase: 'answering',
      };
    }
    const el = renderChallenge(state, () => {});
    expect(el.querySelector('.pinball-instruction')?.textContent).toBe(
      'Convert to decimal:'
    );
  });
});
