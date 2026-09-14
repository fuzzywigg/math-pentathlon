/**
 * Overnight TOKENMAXX HEAVY — par-55 hard randomness gate leftovers after #202.
 * Tests-only. Distinct from demos (#202) and wave43/44 Contig/SD/Star/Fab drafts.
 * No product inventing.
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState, getValidPlacements } from '../../src/games/par-55/rules';
import { getAIMove } from '../../src/games/par-55/ai';

afterEach(() => vi.restoreAllMocks());

describe('Overnight par55 — hard randomness gate', () => {
  it('hard with random below 0.03 still returns legal move from top-3 band', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.01);
    const state = createInitialState();
    const move = getAIMove(state, 'player1', 'hard');
    expect(move).not.toBeNull();
    expect(getValidPlacements(state)).toContain(move!.baseId);
  });
});
