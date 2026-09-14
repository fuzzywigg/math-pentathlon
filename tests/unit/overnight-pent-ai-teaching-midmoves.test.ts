/**
 * Overnight TOKENMAXX HEAVY — pent-em-in AI teaching midmoves leftovers after #202.
 * Tests-only. Distinct from demos (#202) and wave43/44 Contig/SD/Star/Fab drafts.
 * No product inventing.
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/pent-em-in/types';
import { getAIMove } from '../../src/games/pent-em-in/ai';
import { getValidPlacements } from '../../src/games/pent-em-in/rules';

afterEach(() => vi.restoreAllMocks());

describe('Overnight pent — AI teaching midmoves', () => {
  it('easy teaching with low random still returns legal move', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1);
    const state = createInitialState();
    const move = getAIMove(state, 'player1', 'easy');
    expect(move).not.toBeNull();
    const valids = getValidPlacements(state, move!.shapeId, move!.rotation, move!.flipped);
    expect(valids.some((p) => p.row === move!.position.row && p.col === move!.position.col)).toBe(true);
  });
});
