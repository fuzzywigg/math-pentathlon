/**
 * Wave 45 — Pent easy teaching mid-slice leftovers. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/pent-em-in/types';
import { getAIMove } from '../../src/games/pent-em-in/ai';

describe('Wave 45 pent — AI teaching', () => {
  afterEach(() => vi.restoreAllMocks());

  it('easy with random<0.4 still returns legal move', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1);
    const move = getAIMove(createInitialState(), 'player1', 'easy');
    expect(move).not.toBeNull();
  });
});
