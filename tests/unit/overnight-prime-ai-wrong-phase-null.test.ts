/**
 * Overnight TOKENMAXX HEAVY — prime-gold AI wrong phase null leftovers after #202.
 * Tests-only. Distinct from demos (#202) and wave43/44 Contig/SD/Star/Fab drafts.
 * No product inventing.
 */

import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/prime-gold/rules';
import { getAIPlacement, isAITurn } from '../../src/games/prime-gold/ai';

describe('Overnight prime — AI wrong phase null', () => {
  it('getAIPlacement null while rolling', () => {
    const state = createInitialState();
    expect(state.phase).toBe('rolling');
    expect(getAIPlacement(state, 'player1', 'hard')).toBeNull();
  });

  it('isAITurn false for human-vs-human', () => {
    const state = createInitialState();
    expect(isAITurn(state, 'player1', 'human-vs-human')).toBe(false);
  });
});
