/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Pinball choice labels order.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { renderChallenge } from '../../src/games/fraction-pinball/board-ui';

describe('Wave 56 pinball challenge — choice labels order', () => {
  it('button texts match answerChoices order leftover', () => {
    const challenge = {
      id: 'c',
      type: 'fractionToDecimal' as const,
      fraction: { numerator: 1, denominator: 2 },
      decimal: 0.5,
      answerChoices: ['0.5', '0.25', '0.75', '0.2'],
      correctAnswer: '0.5',
    };
    const el = renderChallenge(
      {
        ...createInitialState(),
        phase: 'answering',
        currentChallenge: challenge,
      },
      () => undefined
    );
    const labels = [...el.querySelectorAll('.pinball-choice-btn')].map(
      (b) => b.textContent
    );
    expect(labels).toEqual(challenge.answerChoices);
  });
});
