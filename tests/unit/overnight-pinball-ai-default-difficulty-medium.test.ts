/**
 * Overnight HEAVY after #210 — Pinball getAIAnswer default difficulty = medium.
 * Every #210 overnight call passed an explicit difficulty.
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
  id: 'overnight-default-diff',
  type: 'fractionToDecimal',
  fraction: { numerator: 3, denominator: 4 },
  decimal: 0.75,
  answerChoices: ['0.75', '0.25', '0.5', '1'],
  correctAnswer: '0.75',
};

function answering(): FractionPinballState {
  return {
    ...createInitialState(),
    phase: 'answering',
    currentPlayer: 'player1',
    currentChallenge: challenge,
  };
}

describe('Overnight pinball — default difficulty medium', () => {
  it('omitted difficulty hits when random < 0.78 (medium accuracy)', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    expect(getAIAnswer(answering(), 'player1')).toBe(challenge.correctAnswer);
  });

  it('omitted difficulty misses when random >= 0.78', () => {
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0.85)
      .mockReturnValueOnce(0);
    const ans = getAIAnswer(answering(), 'player1');
    expect(ans).not.toBe(challenge.correctAnswer);
    expect(challenge.answerChoices).toContain(ans!);
  });
});
