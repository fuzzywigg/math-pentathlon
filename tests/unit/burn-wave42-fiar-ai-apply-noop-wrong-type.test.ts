/**
 * Wave 42 — FIAR applyAIMove identity for unknown / empty place.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fiar/types';
import { applyAIMove, AIMove } from '../../src/games/fiar/ai';

describe('Wave 42 FIAR AI — apply noop', () => {
  it('returns same state for place without nodeId and bogus move', () => {
    const state = createInitialState();
    expect(applyAIMove(state, { type: 'place' })).toBe(state);
    const bogus = { type: 'move', from: '9-9', to: '9-8' } as AIMove;
    // Illegal move → rules return same state
    expect(applyAIMove(state, bogus)).toBe(state);
  });
});
