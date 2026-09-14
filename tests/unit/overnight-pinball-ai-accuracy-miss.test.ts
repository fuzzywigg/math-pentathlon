/**
 * Overnight HEAVY — Fraction Pinball medium/hard accuracy miss branches.
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
  id: 'overnight-acc',
  type: 'decimalToFraction',
  fraction: { numerator: 3, denominator: 4 },
  decimal: 0.75,
  answerChoices: ['3/4', '1/2', '2/3', '1/4'],
  correctAnswer: '3/4',
};

function answering(): FractionPinballState {
  return {
    ...createInitialState(),
    phase: 'answering',
    currentPlayer: 'player1',
    currentChallenge: challenge,
  };
}

describe('Overnight pinball — accuracy miss', () => {
  it('medium accuracy 0.78 miss when random >= accuracy', () => {
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0.85) // miss accuracy
      .mockReturnValueOnce(0); // first wrong
    const ans = getAIAnswer(answering(), 'player1', 'medium');
    expect(ans).not.toBe(challenge.correctAnswer);
    expect(challenge.answerChoices).toContain(ans!);
  });

  it('hard accuracy 0.92 miss when random >= accuracy', () => {
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0.95)
      .mockReturnValueOnce(0);
    const ans = getAIAnswer(answering(), 'player1', 'hard');
    expect(ans).not.toBe(challenge.correctAnswer);
    expect(challenge.answerChoices).toContain(ans!);
  });

  it('medium accuracy hit returns correct when random < 0.78', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    expect(getAIAnswer(answering(), 'player1', 'medium')).toBe(
      challenge.correctAnswer
    );
  });
});
