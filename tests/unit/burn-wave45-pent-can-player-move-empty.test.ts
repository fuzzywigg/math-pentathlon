/**
 * Wave 45 — Pent canPlayerMove empty/full leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/pent-em-in/types';
import { canPlayerMove } from '../../src/games/pent-em-in/rules';

describe('Wave 45 pent — canPlayerMove', () => {
  it('true at opening; false with empty available', () => {
    const state = createInitialState();
    expect(canPlayerMove(state, 'player1')).toBe(true);
    const empty = {
      ...state,
      player1Pieces: { available: [], placed: state.player1Pieces.available },
    };
    expect(canPlayerMove(empty, 'player1')).toBe(false);
  });
});
