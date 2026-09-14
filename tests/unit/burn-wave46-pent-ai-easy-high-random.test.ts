/**
 * Wave 46 — Pent easy AI high-random leftover. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/pent-em-in/types';
import { getAIMove } from '../../src/games/pent-em-in/ai';

describe('Wave 46 pent — easy high random', () => {
  afterEach(() => vi.restoreAllMocks());

  it('easy with random=0.99 returns legal shape', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = createInitialState();
    const move = getAIMove(state, 'player1', 'easy');
    expect(move).not.toBeNull();
    expect(state.player1Pieces.available).toContain(move!.shapeId);
  }, 15_000);
});
