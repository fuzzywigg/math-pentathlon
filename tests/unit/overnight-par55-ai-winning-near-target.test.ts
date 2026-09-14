/**
 * Overnight TOKENMAXX HEAVY — par-55 AI near-target win boost leftovers after #202.
 * Tests-only. Distinct from demos (#202) and wave43/44 Contig/SD/Star/Fab drafts.
 * No product inventing.
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState, getValidPlacements, calculateScore } from '../../src/games/par-55/rules';
import { getAIMove } from '../../src/games/par-55/ai';
import { CONFIG } from '../../src/games/par-55/types';

afterEach(() => vi.restoreAllMocks());

describe('Overnight par55 — AI near-target scoring', () => {
  it('hard AI returns move when one point away from target', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const base = createInitialState();
    const state = {
      ...base,
      scores: { player1: CONFIG.TARGET_SCORE - 1, player2: 10 },
    };
    const move = getAIMove(state, 'player1', 'hard');
    expect(move).not.toBeNull();
    const block = state.hands.player1.find((b) => b.id === move!.blockId)!;
    const { totalPoints } = calculateScore(state, block, move!.baseId);
    expect(totalPoints).toBeGreaterThanOrEqual(0);
    expect(getValidPlacements(state)).toContain(move!.baseId);
  });
});
