/**
 * Overnight TOKENMAXX HEAVY — par-55 isAITurn gates leftovers after #202.
 * Tests-only. Distinct from demos (#202) and wave43/44 Contig/SD/Star/Fab drafts.
 * No product inventing.
 */

import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/par-55/rules';
import { isAITurn } from '../../src/games/par-55/ai';

describe('Overnight par55 — isAITurn gates', () => {
  it('requires human-vs-ai and matching seat', () => {
    const state = createInitialState();
    expect(isAITurn(state, 'player1', 'human-vs-human')).toBe(false);
    expect(isAITurn(state, null, 'human-vs-ai')).toBe(false);
    expect(isAITurn(state, 'player1', 'human-vs-ai')).toBe(true);
    expect(isAITurn(state, 'player2', 'human-vs-ai')).toBe(false);
    expect(isAITurn({ ...state, phase: 'gameOver' }, 'player1', 'human-vs-ai')).toBe(false);
  });
});
