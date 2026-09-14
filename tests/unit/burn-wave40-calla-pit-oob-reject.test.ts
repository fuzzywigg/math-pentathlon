/**
 * Wave 40 — Calla pit OOB / wrong-phase select rejects.
 * Tests-only leftover after #178.
 */
import { describe, it, expect } from 'vitest';

import {
  canSelectPit,
  getValidPits,
  makeMove,
} from '../../src/games/calla/rules';
import {
  createInitialState,
  PITS_PER_SIDE,
} from '../../src/games/calla/types';

describe('Wave 40 calla — OOB / phase rejects', () => {
  it('canSelectPit rejects negative and >= PITS_PER_SIDE', () => {
    const state = createInitialState();
    expect(canSelectPit(state, 'player1', -1)).toBe(false);
    expect(canSelectPit(state, 'player1', PITS_PER_SIDE)).toBe(false);
    expect(canSelectPit(state, 'player1', 99)).toBe(false);
  });

  it('makeMove OOB indices are identity', () => {
    const state = createInitialState();
    expect(makeMove(state, -1)).toBe(state);
    expect(makeMove(state, PITS_PER_SIDE)).toBe(state);
    expect(makeMove(state, 99)).toBe(state);
  });

  it('wrong phase → canSelect false and empty valids', () => {
    const state = {
      ...createInitialState(),
      phase: 'animating' as const,
    };
    expect(canSelectPit(state, 'player1', 0)).toBe(false);
    expect(getValidPits(state)).toEqual([]);
    expect(makeMove(state, 0)).toBe(state);
  });

  it('wrong seat cannot select even in selectPit', () => {
    const state = createInitialState();
    expect(canSelectPit(state, 'player2', 0)).toBe(false);
  });
});
