/**
 * Overnight HEAVY after #214/#215 — Hex-a-Gone placement coords leftovers. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import { selectBlock, commitSelection } from '../../src/games/hex-a-gone/rules';
import { getAIPlacement } from '../../src/games/hex-a-gone/ai';

afterEach(() => vi.restoreAllMocks());

describe('Overnight hex-a-gone — placement', () => {
  it('after commit triangle, placement returns finite q/r', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const placing = commitSelection(selectBlock(createInitialState(), 'triangle'));
    expect(placing.phase).toBe('placeBlocks');
    const choice = getAIPlacement(placing, 'player1', 'medium');
    expect(choice).not.toBeNull();
    expect(Number.isFinite(choice!.q)).toBe(true);
    expect(Number.isFinite(choice!.r)).toBe(true);
  }, 15_000);
});
