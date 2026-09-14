/**
 * Overnight HEAVY after #210 — Pinball miss picks last wrong distractor.
 * #210 spies always used second draw 0 → first wrong only.
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
  id: 'overnight-last-wrong',
  type: 'decimalToFraction',
  fraction: { numerator: 2, denominator: 5 },
  decimal: 0.4,
  answerChoices: ['2/5', '1/5', '3/5', '1/2'],
  correctAnswer: '2/5',
};

function answering(): FractionPinballState {
  return {
    ...createInitialState(),
    phase: 'answering',
    currentPlayer: 'player1',
    currentChallenge: challenge,
  };
}

describe('Overnight pinball — wrong choice index last', () => {
  it('medium accuracy miss with random≈0.99 picks last wrong distractor', () => {
    const wrongs = challenge.answerChoices.filter(
      (c) => c !== challenge.correctAnswer
    );
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0.9) // miss medium accuracy
      .mockReturnValueOnce(0.99); // last wrong index
    expect(getAIAnswer(answering(), 'player1', 'medium')).toBe(
      wrongs[wrongs.length - 1]
    );
  });

  it('easy teaching miss with random≈0.99 picks last wrong distractor', () => {
    const wrongs = challenge.answerChoices.filter(
      (c) => c !== challenge.correctAnswer
    );
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0.1) // teaching miss gate
      .mockReturnValueOnce(0.99); // last wrong
    expect(getAIAnswer(answering(), 'player1', 'easy')).toBe(
      wrongs[wrongs.length - 1]
    );
  });
});
