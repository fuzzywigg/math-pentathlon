/**
 * Wave 43 — easy AI teaching/suboptimal branch leftover. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { getAIMove } from '../../src/games/calla/ai';
import { getValidPits } from '../../src/games/calla/rules';

afterEach(() => vi.restoreAllMocks());

describe('Wave 43 calla — AI easy teaching', () => {
  it('easy move is always among valid pits under forced random', () => {
    const state = createInitialState();
    vi.spyOn(Math, 'random').mockReturnValue(0.05);
    const move = getAIMove(state, 'player1', 'easy');
    expect(move).not.toBeNull();
    expect(getValidPits(state)).toContain(move!.pit);
  });
});
