/**
 * Overnight HEAVY — Frac Fact medium/hard accuracy miss + sole-choice fallback.
 * Distinct leftover vs wave42 hard-usually-correct loop. Tests-only.
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

const MULTI: FractionProblem = {
  id: 'multi',
  operand1: { numerator: 1, denominator: 3 },
  operand2: { numerator: 1, denominator: 3 },
  operation: 'add',
  correctAnswer: { numerator: 2, denominator: 3 },
  answerChoices: [
    { numerator: 2, denominator: 3 },
    { numerator: 1, denominator: 3 },
    { numerator: 1, denominator: 2 },
    { numerator: 3, denominator: 3 },
  ],
};

const SOLE: FractionProblem = {
  id: 'sole',
  operand1: { numerator: 1, denominator: 2 },
  operand2: { numerator: 1, denominator: 2 },
  operation: 'add',
  correctAnswer: { numerator: 1, denominator: 1 },
  answerChoices: [{ numerator: 1, denominator: 1 }],
};

function playing(problem: FractionProblem): FracFactState {
  return {
    ...createInitialState('medium'),
    phase: 'playing',
    currentPlayer: 'player1',
    currentProblem: problem,
  };
}

describe('Overnight frac — accuracy miss / fallback', () => {
  it('medium accuracy miss returns a wrong choice', () => {
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0.95) // >= 0.8 accuracy → miss
      .mockReturnValueOnce(0);
    const ans = getAIAnswer(playing(MULTI), 'player1', 'medium');
    expect(ans).not.toBeNull();
    expect(areEquivalent(ans!, MULTI.correctAnswer)).toBe(false);
  });

  it('hard miss with sole choice falls back to correct', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99); // miss accuracy
    const ans = getAIAnswer(playing(SOLE), 'player1', 'hard');
    expect(ans).not.toBeNull();
    expect(areEquivalent(ans!, SOLE.correctAnswer)).toBe(true);
  });
});
