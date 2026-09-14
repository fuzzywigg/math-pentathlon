/**
 * Wave 43 — Ramrod foreign rod select identity leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, selectRod } from '../../src/games/ramrod/rules';

describe('Wave 43 ramrod — foreign rod identity', () => {
  it('cannot select opponent rod; unknown id identity', () => {
    const state = createInitialState();
    const opp = state.playerRods.player2[0];
    expect(selectRod(state, opp)).toBe(state);
    expect(selectRod(state, 'no-such-rod')).toBe(state);
  });
});
