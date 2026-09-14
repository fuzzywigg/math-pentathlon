/**
 * Overnight HEAVY — Fraction Pinball easy teaching intentional miss.
 * Distinct leftover vs wave42 answer matrix (never asserted wrong branch).
 * Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { getAIAnswer } from '../../src/games/fraction-pinball/ai';
import {
  createInitialState,
  type FractionPinballState,
  type ConversionChallenge,
} from '../../src/games/fraction-pinball/types';

afterEach(() => {
  vi.restoreAllMocks();
});

const challenge: ConversionChallenge = {
  id: 'overnight-teach',
  type: 'fractionToDecimal',
  fraction: { numerator: 1, denominator: 2 },
  decimal: 0.5,
  answerChoices: ['0.5', '0.25', '0.75', '1'],
  correctAnswer: '0.5',
};

function answering(
  overrides: Partial<FractionPinballState> = {}
): FractionPinballState {
  return {
    ...createInitialState(),
    phase: 'answering',
    currentPlayer: 'player1',
    currentChallenge: challenge,
    ...overrides,
  };
}

describe('Overnight pinball — teaching miss', () => {
  it('easy teachingMode with random < 0.4 returns a wrong choice', () => {
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0.1) // teaching gate
      .mockReturnValueOnce(0); // first wrong choice
    const ans = getAIAnswer(answering(), 'player1', 'easy');
    expect(ans).not.toBeNull();
    expect(ans).not.toBe(challenge.correctAnswer);
    expect(challenge.answerChoices).toContain(ans!);
  });

  it('easy teaching skip (random >= 0.4) then accuracy hit returns correct', () => {
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0.5) // skip teaching miss
      .mockReturnValueOnce(0.1); // accuracy < 0.6 → correct
    expect(getAIAnswer(answering(), 'player1', 'easy')).toBe(
      challenge.correctAnswer
    );
  });
});
