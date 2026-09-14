/**
 * Overnight HEAVY after #210 — Pinball AI answer as player2 seat.
 * #210 handshake covered wrong-seat nulls / p1 true only.
 * Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  getAIAnswer,
  isAITurn,
} from '../../src/games/fraction-pinball/ai';
import {
  createInitialState,
  type FractionPinballState,
  type ConversionChallenge,
} from '../../src/games/fraction-pinball/types';

afterEach(() => {
  vi.restoreAllMocks();
});

const challenge: ConversionChallenge = {
  id: 'overnight-p2-seat',
  type: 'decimalToFraction',
  fraction: { numerator: 1, denominator: 5 },
  decimal: 0.2,
  answerChoices: ['1/5', '1/4', '1/2', '2/5'],
  correctAnswer: '1/5',
};

function answeringP2(): FractionPinballState {
  return {
    ...createInitialState(),
    phase: 'answering',
    currentPlayer: 'player2',
    currentChallenge: challenge,
  };
}

describe('Overnight pinball — player2 seat answer', () => {
  it('hard accuracy hit as player2 returns correct answer', () => {
    const state = answeringP2();
    vi.spyOn(Math, 'random').mockReturnValue(0);
    expect(getAIAnswer(state, 'player2', 'hard')).toBe(
      challenge.correctAnswer
    );
    expect(isAITurn(state, 'player2')).toBe(true);
    expect(isAITurn(state, 'player1')).toBe(false);
  });
});
