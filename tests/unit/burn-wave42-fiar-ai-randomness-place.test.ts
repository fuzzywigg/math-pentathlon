/**
 * Wave 42 — FIAR AI placement randomness branch (easy).
 * Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/fiar/types';
import { canPlaceChip } from '../../src/games/fiar/rules';
import { getAIMove } from '../../src/games/fiar/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 42 FIAR AI — place randomness', () => {
  it('easy with random<0.4 still returns placeable node', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1);
    const state = createInitialState();
    const move = getAIMove(state, 'player1', 'easy');
    expect(move?.type).toBe('place');
    expect(canPlaceChip(state, move!.nodeId!)).toBe(true);
  });
});
