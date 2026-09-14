/**
 * Overnight HEAVY — Frac Fact easy teaching intentional wrong choice.
 * Distinct leftover vs wave42 statistical easy may-miss. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { getAIAnswer } from '../../src/games/frac-fact/ai';
import {
  createInitialState,
  type FractionProblem,
  type FracFactState,
} from '../../src/games/frac-fact/types';
import { areEquivalent } from '../../src/core/fractions/arithmetic';

afterEach(() => vi.restoreAllMocks());

const PROBLEM: FractionProblem = {
  id: 'overnight-teach',
  operand1: { numerator: 1, denominator: 2 },
  operand2: { numerator: 1, denominator: 4 },
  operation: 'add',
  correctAnswer: { numerator: 3, denominator: 4 },
  answerChoices: [
    { numerator: 3, denominator: 4 },
    { numerator: 1, denominator: 2 },
    { numerator: 2, denominator: 6 },
    { numerator: 1, denominator: 4 },
  ],
};

function playing(overrides: Partial<FracFactState> = {}): FracFactState {
  return {
    ...createInitialState('easy'),
    phase: 'playing',
    currentPlayer: 'player1',
    currentProblem: PROBLEM,
    ...overrides,
  };
}

describe('Overnight frac — teaching miss', () => {
  it('easy teachingMode random < 0.35 returns a wrong choice', () => {
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0.1) // teaching gate
      .mockReturnValueOnce(0); // first wrong
    const ans = getAIAnswer(playing(), 'player1', 'easy');
    expect(ans).not.toBeNull();
    expect(areEquivalent(ans!, PROBLEM.correctAnswer)).toBe(false);
  });

  it('easy skip teaching then accuracy hit returns correct', () => {
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0.5) // skip teaching
      .mockReturnValueOnce(0.1); // accuracy < 0.65 → correct
    const ans = getAIAnswer(playing(), 'player1', 'easy');
    expect(ans).not.toBeNull();
    expect(areEquivalent(ans!, PROBLEM.correctAnswer)).toBe(true);
  });
});
