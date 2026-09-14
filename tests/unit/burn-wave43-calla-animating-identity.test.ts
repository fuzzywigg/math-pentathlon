/**
 * Wave 43 — Calla animating phase makeMove identity leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { makeMove, canSelectPit, getValidPits } from '../../src/games/calla/rules';

describe('Wave 43 calla — animating identity', () => {
  it('animating rejects select/move', () => {
    const state = { ...createInitialState(), phase: 'animating' as const };
    expect(canSelectPit(state, 'player1', 0)).toBe(false);
    expect(getValidPits(state)).toEqual([]);
    expect(makeMove(state, 0)).toBe(state);
  });
});
