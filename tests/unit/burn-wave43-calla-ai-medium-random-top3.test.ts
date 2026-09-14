/**
 * Wave 43 — medium AI randomness top-3 leftover. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { getAIMove } from '../../src/games/calla/ai';
import { getValidPits } from '../../src/games/calla/rules';

afterEach(() => vi.restoreAllMocks());

describe('Wave 43 calla — AI medium random', () => {
  it('medium with high randomness still returns valid pit', () => {
    const state = createInitialState();
    vi.spyOn(Math, 'random').mockReturnValue(0.01);
    const move = getAIMove(state, 'player1', 'medium');
    expect(move).not.toBeNull();
    expect(getValidPits(state)).toContain(move!.pit);
  });
});
