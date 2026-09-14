/**
 * Overnight HEAVY — Pinball accuracy miss when only correct choice remains.
 * Falls back to correctAnswer when wrongChoices empty.
 * Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { getAIAnswer } from '../../src/games/fraction-pinball/ai';
import {
  createInitialState,
  type ConversionChallenge,
} from '../../src/games/fraction-pinball/types';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Overnight pinball — sole-choice fallback', () => {
  it('accuracy miss with only correct choice still returns correct', () => {
    const challenge: ConversionChallenge = {
      id: 'sole',
      type: 'fractionToDecimal',
      fraction: { numerator: 1, denominator: 5 },
      decimal: 0.2,
      answerChoices: ['0.2'],
      correctAnswer: '0.2',
    };
    const state = {
      ...createInitialState(),
      phase: 'answering' as const,
      currentPlayer: 'player1' as const,
      currentChallenge: challenge,
    };
    // Force miss branch; wrongChoices empty → correctAnswer fallback
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    expect(getAIAnswer(state, 'player1', 'hard')).toBe('0.2');
  });

  it('easy teaching miss with sole choice skips wrong path → accuracy path', () => {
    const challenge: ConversionChallenge = {
      id: 'sole-easy',
      type: 'fractionToDecimal',
      fraction: { numerator: 1, denominator: 1 },
      decimal: 1,
      answerChoices: ['1'],
      correctAnswer: '1',
    };
    const state = {
      ...createInitialState(),
      phase: 'answering' as const,
      currentPlayer: 'player1' as const,
      currentChallenge: challenge,
    };
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0.1) // enter teaching
      .mockReturnValueOnce(0.1); // accuracy hit
    expect(getAIAnswer(state, 'player1', 'easy')).toBe('1');
  });
});
