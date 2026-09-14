/**
 * Overnight TOKENMAXX HEAVY leftovers after #250 — Pinball easy teaching miss leftover.
 * Distinct from sole-choice fallback. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { getAIAnswer } from '../../src/games/fraction-pinball/ai';
import { createInitialState } from '../../src/games/fraction-pinball/types';

afterEach(() => vi.restoreAllMocks());

describe('Wave 55 pinball AI — easy teaching miss', () => {
  it('teaching gate picks a wrong leftover choice', () => {
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0.1)
      .mockReturnValueOnce(0);
    const state = {
      ...createInitialState(),
      phase: 'answering' as const,
      currentPlayer: 'player2' as const,
      currentChallenge: {
        id: 'e',
        type: 'fractionToDecimal' as const,
        fraction: { numerator: 1, denominator: 2 },
        decimal: 0.5,
        answerChoices: ['0.5', '0.25', '0.75'],
        correctAnswer: '0.5',
      },
    };
    expect(getAIAnswer(state, 'player2', 'easy')).toBe('0.25');
  });
});
