/**
 * Overnight HEAVY — Pent getAIMove null when no pieces available.
 * Distinct leftover empty-bank style edge. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { getAIMove } from '../../src/games/pent-em-in/ai';
import { createInitialState } from '../../src/games/pent-em-in/types';

afterEach(() => vi.restoreAllMocks());

describe('Overnight pent — empty available null', () => {
  it('returns null when current player has empty available list', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = createInitialState();
    const drained = {
      ...state,
      player1Pieces: { available: [], placed: state.player1Pieces.available },
    };
    expect(getAIMove(drained, 'player1', 'hard')).toBeNull();
  });
});
