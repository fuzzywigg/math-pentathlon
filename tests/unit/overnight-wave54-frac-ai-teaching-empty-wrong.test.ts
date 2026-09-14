/**
 * Overnight TOKENMAXX HEAVY leftover — Frac Fact easy teaching with no wrong indices.
 * Distinct from overnight teaching-miss (has distractors). Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { getAIAnswer } from '../../src/games/frac-fact/ai';
import {
  createInitialState,
  type FractionProblem,
} from '../../src/games/frac-fact/types';
import { areEquivalent } from '../../src/core/fractions/arithmetic';

afterEach(() => vi.restoreAllMocks());

const ALL_EQUIV: FractionProblem = {
  id: 'all-equiv',
  operand1: { numerator: 1, denominator: 2 },
  operand2: { numerator: 1, denominator: 4 },
  operation: 'add',
  correctAnswer: { numerator: 3, denominator: 4 },
  answerChoices: [
    { numerator: 3, denominator: 4 },
    { numerator: 6, denominator: 8 },
    { numerator: 9, denominator: 12 },
    { numerator: 12, denominator: 16 },
  ],
};

describe('Wave 54 frac AI — teaching empty wrongIndices', () => {
  it('easy teaching gate + accuracy miss still returns an equivalent of correct', () => {
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0.1)
      .mockReturnValueOnce(0.99);
    const state = {
      ...createInitialState('easy'),
      phase: 'playing' as const,
      currentPlayer: 'player1' as const,
      currentProblem: ALL_EQUIV,
    };
    const ans = getAIAnswer(state, 'player1', 'easy');
    expect(ans).not.toBeNull();
    expect(areEquivalent(ans!, ALL_EQUIV.correctAnswer)).toBe(true);
  });
});
