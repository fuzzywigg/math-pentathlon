/**
 * Overnight TOKENMAXX HEAVY — frac-fact AI accuracy miss fallback leftovers after #202.
 * Tests-only. Distinct from demos (#202) and wave43/44 Contig/SD/Star/Fab drafts.
 * No product inventing.
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { getAIAnswer } from '../../src/games/frac-fact/ai';
import { areEquivalent } from '../../src/core/fractions/arithmetic';

afterEach(() => vi.restoreAllMocks());

describe('Overnight frac-fact — AI accuracy miss fallback', () => {
  it('when only correct choice exists, medium miss falls back to correct', () => {
    const correct = { numerator: 1, denominator: 2 };
    const state = {
      ...createInitialState(),
      phase: 'playing' as const,
      currentPlayer: 'player1' as const,
      currentProblem: {
        id: 'p',
        operand1: { numerator: 1, denominator: 4 },
        operand2: { numerator: 1, denominator: 4 },
        operation: 'add' as const,
        correctAnswer: correct,
        answerChoices: [correct],
      },
    };
    // First random for teaching skipped (medium); second for accuracy — force miss
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const answer = getAIAnswer(state, 'player1', 'medium');
    expect(answer).not.toBeNull();
    expect(areEquivalent(answer!, correct)).toBe(true);
  });
});
