/**
 * Wave 45 — Pent getAIMove null gates leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/pent-em-in/types';
import { getAIMove } from '../../src/games/pent-em-in/ai';

describe('Wave 45 pent — AI null gates', () => {
  it('null on gameOver and wrong seat', () => {
    const state = createInitialState();
    expect(getAIMove({ ...state, phase: 'gameOver' }, 'player1', 'hard')).toBeNull();
    expect(getAIMove(state, 'player2', 'hard')).toBeNull();
  });
});
