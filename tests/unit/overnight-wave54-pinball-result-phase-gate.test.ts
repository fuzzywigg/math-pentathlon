/**
 * Wave 54 leftover after #240 — Pinball result empty outside showResult. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { renderResult } from '../../src/games/fraction-pinball/board-ui';

describe('Wave 54 pinball — result phase gate', () => {
  it('stays empty in answering even with a challenge', () => {
    const el = renderResult(
      {
        ...createInitialState(),
        phase: 'answering',
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
    expect(el.children.length).toBe(0);
  });
});
