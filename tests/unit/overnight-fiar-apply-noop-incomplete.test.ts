/**
 * Overnight HEAVY — FIAR applyAIMove identity on incomplete move payloads.
 * Distinct leftover vs wave42 wrong-type noop. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { applyAIMove } from '../../src/games/fiar/ai';
import { createInitialState } from '../../src/games/fiar/types';

describe('Overnight fiar — apply noop incomplete', () => {
  it('place without nodeId and move without from/to return same state', () => {
    const state = createInitialState();
    expect(applyAIMove(state, { type: 'place' })).toBe(state);
    expect(applyAIMove(state, { type: 'move' })).toBe(state);
    expect(applyAIMove(state, { type: 'move', from: '0-0' })).toBe(state);
  });
});
