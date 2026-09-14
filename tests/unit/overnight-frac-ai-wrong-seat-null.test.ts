/**
 * Overnight TOKENMAXX HEAVY — frac-fact AI wrong seat null leftovers after #202.
 * Tests-only. Distinct from demos (#202) and wave43/44 Contig/SD/Star/Fab drafts.
 * No product inventing.
 */

import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { generateProblem } from '../../src/games/frac-fact/rules';
import { getAIAnswer } from '../../src/games/frac-fact/ai';

describe('Overnight frac-fact — AI wrong seat', () => {
  it('returns null when currentPlayer is not aiPlayer', () => {
    const problem = generateProblem('medium', 1);
    const state = {
      ...createInitialState(),
      phase: 'playing' as const,
      currentPlayer: 'player1' as const,
      currentProblem: problem,
    };
    expect(getAIAnswer(state, 'player2', 'hard')).toBeNull();
  });
});
