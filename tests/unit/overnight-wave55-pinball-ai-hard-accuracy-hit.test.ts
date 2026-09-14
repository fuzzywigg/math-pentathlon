/**
 * Overnight TOKENMAXX HEAVY leftovers after #250 — Pinball hard accuracy hit leftover.
 * Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { getAIAnswer } from '../../src/games/fraction-pinball/ai';
import { createInitialState } from '../../src/games/fraction-pinball/types';

afterEach(() => vi.restoreAllMocks());

describe('Wave 55 pinball AI — hard accuracy hit', () => {
  it('hard under accuracy returns correctAnswer leftover', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.05);
    const state = {
      ...createInitialState(),
      phase: 'answering' as const,
      currentPlayer: 'player1' as const,
      currentChallenge: {
        id: 'h',
        type: 'decimalToFraction' as const,
        fraction: { numerator: 3, denominator: 4 },
        decimal: 0.75,
        answerChoices: ['3/4', '1/2', '1/4', '2/3'],
        correctAnswer: '3/4',
      },
    };
    expect(getAIAnswer(state, 'player1', 'hard')).toBe('3/4');
  });
});
