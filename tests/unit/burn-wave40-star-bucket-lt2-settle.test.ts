/**
 * Wave 40 — Star Track drawChains bucket length < 2 settle + select identity.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/star-track/types';
import {
  drawChains,
  selectChain,
  getPhaseMessage,
} from '../../src/games/star-track/rules';

describe('Wave 40 star-track — bucket lt2 settle', () => {
  it('drawChains with empty bucket settles gameOver', () => {
    const state = {
      ...createInitialState(),
      chainBucket: [],
      player1Position: 4,
      player2Position: 4,
    };
    const ended = drawChains(state);
    expect(ended.phase).toBe('gameOver');
    expect(ended.winner).toBeNull();
  });

  it('drawChains with chainBucket length 1 settles gameOver by position', () => {
    const link = createInitialState().chainBucket[0];
    const state = {
      ...createInitialState(),
      chainBucket: [link],
      player1Position: 7,
      player2Position: 2,
    };
    const ended = drawChains(state);
    expect(ended.phase).toBe('gameOver');
    expect(ended.winner).toBe('player1');
  });

  it('selectChain wrong phase → identity', () => {
    const state = createInitialState();
    expect(state.phase).toBe('drawChains');
    expect(selectChain(state, 0)).toBe(state);
    expect(selectChain(state, 1)).toBe(state);

    const over = { ...state, phase: 'gameOver' as const, winner: null };
    expect(selectChain(over, 0)).toBe(over);
  });

  it('getPhaseMessage for gameOver with winner null (draw)', () => {
    const state = {
      ...createInitialState(),
      phase: 'gameOver' as const,
      winner: null,
    };
    expect(getPhaseMessage(state)).toMatch(/draw/i);
  });
});
