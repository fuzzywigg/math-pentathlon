/**
 * Overnight HEAVY after #210 — Pinball easy: teach-skip then accuracy miss.
 * #210 teaching covered skip→hit; accuracy-miss file was medium/hard only.
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
  id: 'overnight-easy-acc-miss',
  type: 'fractionToDecimal',
  fraction: { numerator: 1, denominator: 4 },
  decimal: 0.25,
  answerChoices: ['0.25', '0.5', '0.75', '0.2'],
  correctAnswer: '0.25',
};

function answering(): FractionPinballState {
  return {
    ...createInitialState(),
    phase: 'answering',
    currentPlayer: 'player1',
    currentChallenge: challenge,
  };
}

describe('Overnight pinball — easy accuracy miss after teach skip', () => {
  it('teach skip (random >= 0.4) then accuracy miss (>= 0.6) returns wrong', () => {
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0.5) // skip teaching miss
      .mockReturnValueOnce(0.7) // miss accuracy (easy threshold 0.6)
      .mockReturnValueOnce(0); // first wrong distractor
    const ans = getAIAnswer(answering(), 'player1', 'easy');
    expect(ans).not.toBeNull();
    expect(ans).not.toBe(challenge.correctAnswer);
    expect(challenge.answerChoices).toContain(ans!);
  });
});
