/**
 * Wave 40 — Star Track bucket &lt;2 settle + wrong-phase select + draw message.
 * Tests-only leftover after #178.
 */
import { describe, it, expect } from 'vitest';

import {
  drawChains,
  selectChain,
  getPhaseMessage,
} from '../../src/games/star-track/rules';
import { createInitialState } from '../../src/games/star-track/types';

describe('Wave 40 star-track — bucket settle / phase', () => {
  it('drawChains with empty bucket settles gameOver draw', () => {
    const state = {
      ...createInitialState(),
      chainBucket: [],
      player1Position: 3,
      player2Position: 3,
    };
    const next = drawChains(state);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBeNull();
    expect(getPhaseMessage(next)).toMatch(/draw/i);
  });

  it('drawChains with one chain settles by position', () => {
    const state = {
      ...createInitialState(),
      chainBucket: [{ id: 'c1', length: 2 }],
      player1Position: 5,
      player2Position: 2,
    };
    const next = drawChains(state);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player1');
  });

  it('selectChain wrong phase → identity', () => {
    const state = createInitialState();
    expect(selectChain(state, 0)).toBe(state);
  });

  it('drawChains wrong phase → identity', () => {
    const state = {
      ...createInitialState(),
      phase: 'selectChain' as const,
    };
    expect(drawChains(state)).toBe(state);
  });
});
