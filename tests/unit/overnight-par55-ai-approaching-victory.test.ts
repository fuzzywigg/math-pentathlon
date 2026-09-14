/**
 * Overnight TOKENMAXX HEAVY — par-55 AI approaching victory leftovers after #202.
 * Tests-only. Distinct from demos (#202) and wave43/44 Contig/SD/Star/Fab drafts.
 * No product inventing.
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState, getValidPlacements } from '../../src/games/par-55/rules';
import { getAIMove } from '../../src/games/par-55/ai';
import { CONFIG } from '../../src/games/par-55/types';

afterEach(() => vi.restoreAllMocks());

describe('Overnight par55 — AI approaching victory', () => {
  it('hard AI still returns a legal move when score is within 10 of target', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const base = createInitialState();
    const state = {
      ...base,
      scores: { player1: CONFIG.TARGET_SCORE - 5, player2: 0 },
    };
    const move = getAIMove(state, 'player1', 'hard');
    expect(move).not.toBeNull();
    expect(getValidPlacements(state)).toContain(move!.baseId);
    expect(state.hands.player1.some((b) => b.id === move!.blockId)).toBe(true);
  });
});
