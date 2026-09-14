/**
 * Overnight TOKENMAXX HEAVY leftover — Frac Fact getAIAnswer default difficulty.
 * Prior overnight/wave calls always passed easy/medium/hard explicitly. Tests-only.
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
  id: 'default-diff',
  operand1: { numerator: 1, denominator: 2 },
  operand2: { numerator: 1, denominator: 4 },
  operation: 'add',
  correctAnswer: { numerator: 3, denominator: 4 },
  answerChoices: [
    { numerator: 3, denominator: 4 },
    { numerator: 1, denominator: 2 },
    { numerator: 1, denominator: 4 },
    { numerator: 2, denominator: 3 },
  ],
};

function playing(): FracFactState {
  return {
    ...createInitialState('medium'),
    phase: 'playing',
    currentPlayer: 'player1',
    currentProblem: PROBLEM,
  };
}

describe('Wave 54 frac AI — omitted difficulty defaults to medium', () => {
  it('random 0.20 is below medium accuracy 0.8 so picks correct (easy would teach-miss)', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.2);
    const ans = getAIAnswer(playing(), 'player1');
    expect(ans).not.toBeNull();
    expect(areEquivalent(ans!, PROBLEM.correctAnswer)).toBe(true);
  });

  it('random >= 0.8 misses and returns a wrong listed choice', () => {
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0.9)
      .mockReturnValueOnce(0);
    const ans = getAIAnswer(playing(), 'player1');
    expect(ans).not.toBeNull();
    expect(areEquivalent(ans!, PROBLEM.correctAnswer)).toBe(false);
    expect(
      PROBLEM.answerChoices.some(
        (c) => c.numerator === ans!.numerator && c.denominator === ans!.denominator
      )
    ).toBe(true);
  });
});
