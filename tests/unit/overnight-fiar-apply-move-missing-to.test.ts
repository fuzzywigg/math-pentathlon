/**
 * Overnight TOKENMAXX — FIAR applyAIMove missing-to noop leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fiar/types';
import { applyAIMove } from '../../src/games/fiar/ai';

describe('Overnight fiar — applyAIMove noop', () => {
  it('move without to returns same ref', () => {
    const state = createInitialState();
    const next = applyAIMove(state, { type: 'move', from: '0-0' });
    expect(next).toBe(state);
  });
});
