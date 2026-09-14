/**
 * Wave 45 — Pent medium randomness top-5 leftovers. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/pent-em-in/types';
import { getAIMove } from '../../src/games/pent-em-in/ai';

describe('Wave 45 pent — AI medium random', () => {
  afterEach(() => vi.restoreAllMocks());

  it('medium random band returns a move', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.05);
    expect(getAIMove(createInitialState(), 'player1', 'medium')).not.toBeNull();
  });
});
