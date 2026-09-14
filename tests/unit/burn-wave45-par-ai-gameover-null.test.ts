/**
 * Wave 45 — Par 55 getAIMove gameOver/wrong-seat null leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/par-55/rules';
import { getAIMove } from '../../src/games/par-55/ai';

describe('Wave 45 par — AI null gates', () => {
  it('returns null on gameOver and wrong seat', () => {
    const state = createInitialState();
    expect(getAIMove({ ...state, phase: 'gameOver' }, 'player1', 'hard')).toBeNull();
    expect(getAIMove(state, 'player2', 'hard')).toBeNull();
  });
});
