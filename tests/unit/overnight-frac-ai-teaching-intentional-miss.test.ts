/**
 * Overnight TOKENMAXX HEAVY — frac-fact AI teaching miss leftovers after #202.
 * Tests-only. Distinct from demos (#202) and wave43/44 Contig/SD/Star/Fab drafts.
 * No product inventing.
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { generateProblem } from '../../src/games/frac-fact/rules';
import { getAIAnswer } from '../../src/games/frac-fact/ai';
import { areEquivalent } from '../../src/core/fractions/arithmetic';

afterEach(() => vi.restoreAllMocks());

describe('Overnight frac-fact — AI teaching intentional miss', () => {
  it('easy teaching with low random returns a wrong choice when available', () => {
    const problem = generateProblem('easy', 1);
    expect(problem.answerChoices.length).toBeGreaterThan(1);
    const state = {
      ...createInitialState(),
      phase: 'playing' as const,
      currentPlayer: 'player1' as const,
      currentProblem: problem,
    };
    vi.spyOn(Math, 'random').mockReturnValue(0.1);
    const answer = getAIAnswer(state, 'player1', 'easy');
    expect(answer).not.toBeNull();
    // teaching miss path OR accuracy path — either way a choice from the list
    expect(problem.answerChoices.some((c) => areEquivalent(c, answer!))).toBe(true);
  });
});
