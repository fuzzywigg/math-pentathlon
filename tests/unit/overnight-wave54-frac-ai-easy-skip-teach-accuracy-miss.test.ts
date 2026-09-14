/**
 * Overnight TOKENMAXX HEAVY leftover — Frac Fact easy skip teaching then accuracy miss.
 * Distinct from overnight teaching-miss skip→hit. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { getAIAnswer } from '../../src/games/frac-fact/ai';
import {
  createInitialState,
  type FractionProblem,
} from '../../src/games/frac-fact/types';
import { areEquivalent } from '../../src/core/fractions/arithmetic';

afterEach(() => vi.restoreAllMocks());

const PROBLEM: FractionProblem = {
  id: 'skip-miss',
  operand1: { numerator: 2, denominator: 3 },
  operand2: { numerator: 1, denominator: 3 },
  operation: 'add',
  correctAnswer: { numerator: 1, denominator: 1 },
  answerChoices: [
    { numerator: 1, denominator: 1 },
    { numerator: 1, denominator: 2 },
    { numerator: 2, denominator: 3 },
    { numerator: 3, denominator: 4 },
  ],
};

describe('Wave 54 frac AI — easy skip teaching then miss', () => {
  it('random >= 0.35 then >= 0.65 picks a wrong choice', () => {
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0.4)
      .mockReturnValueOnce(0.7)
      .mockReturnValueOnce(0);
    const state = {
      ...createInitialState('easy'),
      phase: 'playing' as const,
      currentPlayer: 'player1' as const,
      currentProblem: PROBLEM,
    };
    const ans = getAIAnswer(state, 'player1', 'easy');
    expect(ans).not.toBeNull();
    expect(areEquivalent(ans!, PROBLEM.correctAnswer)).toBe(false);
  });
});
