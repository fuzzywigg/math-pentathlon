/**
 * Wave 54 leftover after #240 — Pinball hit star animation. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { renderResult } from '../../src/games/fraction-pinball/board-ui';

describe('Wave 54 pinball — hit stars', () => {
  it('renders ★ ★ ★ animation only on hit', () => {
    const challenge = {
      id: 'c',
      type: 'fractionToDecimal' as const,
      fraction: { numerator: 1, denominator: 2 },
      decimal: 0.5,
      answerChoices: ['0.5'],
      correctAnswer: '0.5',
    };
    const hit = renderResult(
      {
        ...createInitialState(),
        phase: 'showResult',
        isCorrect: true,
        currentChallenge: challenge,
      },
      () => undefined
    );
    expect(hit.querySelector('.pinball-animation')?.textContent?.trim()).toBe(
      '★ ★ ★'
    );
    const miss = renderResult(
      {
        ...createInitialState(),
        phase: 'showResult',
        isCorrect: false,
        currentChallenge: challenge,
      },
      () => undefined
    );
    expect(miss.querySelector('.pinball-animation')).toBeNull();
  });
});
