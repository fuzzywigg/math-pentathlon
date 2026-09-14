/**
 * Overnight TOKENMAXX HEAVY — par-55 AI teaching suboptimal leftovers after #202.
 * Tests-only. Distinct from demos (#202) and wave43/44 Contig/SD/Star/Fab drafts.
 * No product inventing.
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState, getValidPlacements } from '../../src/games/par-55/rules';
import { getAIMove } from '../../src/games/par-55/ai';

afterEach(() => vi.restoreAllMocks());

describe('Overnight par55 — AI teaching suboptimal', () => {
  it('easy teaching path returns a legal placement', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1);
    const state = createInitialState();
    const move = getAIMove(state, 'player1', 'easy');
    expect(move).not.toBeNull();
    expect(getValidPlacements(state)).toContain(move!.baseId);
  });

  it('easy with high random still returns top-path legal move', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.9);
    const state = createInitialState();
    const move = getAIMove(state, 'player1', 'easy');
    expect(move).not.toBeNull();
    expect(getValidPlacements(state)).toContain(move!.baseId);
  });
});
