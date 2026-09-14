/**
 * Overnight TOKENMAXX HEAVY — pent-em-in AI wrong seat null leftovers after #202.
 * Tests-only. Distinct from demos (#202) and wave43/44 Contig/SD/Star/Fab drafts.
 * No product inventing.
 */

import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/pent-em-in/types';
import { getAIMove, isAITurn } from '../../src/games/pent-em-in/ai';

describe('Overnight pent — AI wrong seat null', () => {
  it('getAIMove null for wrong seat; isAITurn false for null seat', () => {
    const state = createInitialState();
    expect(getAIMove(state, 'player2', 'hard')).toBeNull();
    expect(isAITurn(state, null)).toBe(false);
    expect(isAITurn(state, 'player2')).toBe(false);
  });
});
