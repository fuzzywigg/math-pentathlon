/**
 * Overnight HEAVY leftover — Calla hard AI takes a 5+ capture immediately.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { getAIMove } from '../../src/games/calla/ai';
import { makeMove } from '../../src/games/calla/rules';

afterEach(() => vi.restoreAllMocks());

describe('Overnight wave50 calla — hard big capture', () => {
  it('hard returns the 6-cube capture pit without needing a deep search', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = {
      ...createInitialState(),
      player1Pits: [1, 0, 2, 0, 0],
      player2Pits: [0, 0, 0, 5, 1],
    };
    const move = getAIMove(state, 'player1', 'hard');
    expect(move).not.toBeNull();
    expect(move!.pit).toBe(0);
    const next = makeMove(state, move!.pit);
    expect(next.moveHistory[0].captured).toBeGreaterThanOrEqual(5);
  });
});
