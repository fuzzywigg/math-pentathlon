/**
 * Overnight TOKENMAXX HEAVY leftovers after #250 — Pinball getAIAnswer showResult leftover.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getAIAnswer, isAITurn } from '../../src/games/fraction-pinball/ai';
import { createInitialState } from '../../src/games/fraction-pinball/types';

describe('Wave 55 pinball AI — showResult null', () => {
  it('gates answering leftover', () => {
    const state = {
      ...createInitialState(),
      phase: 'showResult' as const,
      currentPlayer: 'player2' as const,
      currentChallenge: {
        id: 'c',
        type: 'fractionToDecimal' as const,
        fraction: { numerator: 1, denominator: 2 },
        decimal: 0.5,
        answerChoices: ['0.5', '0.25'],
        correctAnswer: '0.5',
      },
    };
    expect(getAIAnswer(state, 'player2', 'hard')).toBeNull();
    expect(isAITurn(state, 'player2')).toBe(false);
  });
});
