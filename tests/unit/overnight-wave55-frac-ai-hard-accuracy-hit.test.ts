/**
 * Overnight TOKENMAXX HEAVY leftovers after #250 — Frac Fact hard accuracy hit (no teaching).
 * Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { getAIAnswer } from '../../src/games/frac-fact/ai';
import { createInitialState } from '../../src/games/frac-fact/types';
import { areEquivalent } from '../../src/core/fractions/arithmetic';

afterEach(() => vi.restoreAllMocks());

describe('Wave 55 frac AI — hard accuracy hit', () => {
  it('hard with random under accuracy returns correct choice', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1);
    const state = {
      ...createInitialState('hard'),
      phase: 'playing' as const,
      currentPlayer: 'player2' as const,
      currentProblem: {
        id: 'h',
        operand1: { numerator: 1, denominator: 2 },
        operand2: { numerator: 1, denominator: 3 },
        operation: 'multiply' as const,
        correctAnswer: { numerator: 1, denominator: 6 },
        answerChoices: [
          { numerator: 1, denominator: 6 },
          { numerator: 1, denominator: 5 },
          { numerator: 2, denominator: 3 },
          { numerator: 1, denominator: 2 },
        ],
      },
    };
    const ans = getAIAnswer(state, 'player2', 'hard');
    expect(ans).not.toBeNull();
    expect(areEquivalent(ans!, state.currentProblem.correctAnswer)).toBe(true);
  });
});
