/**
 * Overnight TOKENMAXX HEAVY — pent-em-in AI gameOver null leftovers after #202.
 * Tests-only. Distinct from demos (#202) and wave43/44 Contig/SD/Star/Fab drafts.
 * No product inventing.
 */

import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/pent-em-in/types';
import { getAIMove } from '../../src/games/pent-em-in/ai';

describe('Overnight pent — AI gameOver null', () => {
  it('returns null when phase is gameOver', () => {
    const state = {
      ...createInitialState(),
      phase: 'gameOver' as const,
      winner: 'player1' as const,
    };
    expect(getAIMove(state, 'player1', 'hard')).toBeNull();
  });
});
