/**
 * Wave 43 — getAIMove null when no valid pits leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, type CallaGameState } from '../../src/games/calla/types';
import { getAIMove } from '../../src/games/calla/ai';
import { getValidPits } from '../../src/games/calla/rules';

describe('Wave 43 calla — AI empty valids', () => {
  it('all-zero own pits yields null AI move', () => {
    const state: CallaGameState = {
      ...createInitialState(),
      player1Pits: [0, 0, 0, 0, 0],
      player2Pits: [3, 3, 3, 3, 3],
    };
    expect(getValidPits(state)).toEqual([]);
    expect(getAIMove(state, 'player1', 'hard')).toBeNull();
  });

  it('wrong seat returns null', () => {
    expect(getAIMove(createInitialState(), 'player2', 'medium')).toBeNull();
  });
});
