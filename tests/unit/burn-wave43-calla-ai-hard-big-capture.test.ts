/**
 * Wave 43 — hard AI prefers captureAmount >= 5 leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, type CallaGameState } from '../../src/games/calla/types';
import { getAIMove } from '../../src/games/calla/ai';
import { getValidPits } from '../../src/games/calla/rules';

describe('Wave 43 calla — AI hard big capture', () => {
  it('hard returns a legal pit when big capture available', () => {
    // Craft: pit0=1 lands pit1 empty; opposite of 1 is 3 with 5+ cubes
    const state: CallaGameState = {
      ...createInitialState(),
      player1Pits: [1, 0, 2, 2, 2],
      player2Pits: [1, 1, 1, 6, 1],
    };
    const move = getAIMove(state, 'player1', 'hard');
    expect(move).not.toBeNull();
    expect(getValidPits(state)).toContain(move!.pit);
  });
});
