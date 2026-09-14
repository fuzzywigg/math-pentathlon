/**
 * Overnight HEAVY leftover after #234 — Frac Fact getAIAnswer default = medium.
 * Pinball has overnight default-difficulty; frac-fact always passed explicit. Tests-only.
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
  operand2: { numerator: 1, denominator: 3 },
  operation: 'add',
  correctAnswer: { numerator: 5, denominator: 6 },
  answerChoices: [
    { numerator: 5, denominator: 6 },
    { numerator: 1, denominator: 2 },
    { numerator: 2, denominator: 5 },
    { numerator: 1, denominator: 6 },
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

describe('Wave 52 frac — default difficulty medium', () => {
  it('omitted difficulty hits when random < 0.8', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const ans = getAIAnswer(playing(), 'player1');
    expect(areEquivalent(ans!, PROBLEM.correctAnswer)).toBe(true);
  });

  it('omitted difficulty misses when random >= 0.8', () => {
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0.85)
      .mockReturnValueOnce(0);
    const ans = getAIAnswer(playing(), 'player1');
    expect(areEquivalent(ans!, PROBLEM.correctAnswer)).toBe(false);
    expect(PROBLEM.answerChoices).toContainEqual(ans!);
  });
});
