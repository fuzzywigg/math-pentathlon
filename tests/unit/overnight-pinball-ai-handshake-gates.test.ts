/**
 * Overnight HEAVY — Fraction Pinball AI handshake null / isAITurn gates.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getAIAnswer, isAITurn } from '../../src/games/fraction-pinball/ai';
import {
  createInitialState,
  type ConversionChallenge,
} from '../../src/games/fraction-pinball/types';

const challenge: ConversionChallenge = {
  id: 'overnight-hs',
  type: 'fractionToDecimal',
  fraction: { numerator: 1, denominator: 4 },
  decimal: 0.25,
  answerChoices: ['0.25', '0.5'],
  correctAnswer: '0.25',
};

describe('Overnight pinball — handshake gates', () => {
  it('wrong phase / wrong seat / null challenge → null', () => {
    const base = {
      ...createInitialState(),
      currentChallenge: challenge,
      currentPlayer: 'player1' as const,
    };
    expect(
      getAIAnswer({ ...base, phase: 'showResult' }, 'player1', 'hard')
    ).toBeNull();
    expect(
      getAIAnswer({ ...base, phase: 'gameOver' }, 'player1', 'easy')
    ).toBeNull();
    expect(
      getAIAnswer(
        { ...base, phase: 'answering', currentPlayer: 'player2' },
        'player1',
        'medium'
      )
    ).toBeNull();
    expect(
      getAIAnswer(
        { ...createInitialState(), phase: 'answering', currentChallenge: null },
        'player1',
        'hard'
      )
    ).toBeNull();
  });

  it('isAITurn requires answering + matching seat', () => {
    const answering = {
      ...createInitialState(),
      phase: 'answering' as const,
      currentPlayer: 'player1' as const,
      currentChallenge: challenge,
    };
    expect(isAITurn(answering, 'player1')).toBe(true);
    expect(isAITurn(answering, null)).toBe(false);
    expect(isAITurn(answering, 'player2')).toBe(false);
    expect(
      isAITurn({ ...answering, phase: 'showResult' }, 'player1')
    ).toBe(false);
  });
});
