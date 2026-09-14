/**
 * Wave 46 — Pent isAITurn seat leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/pent-em-in/types';
import { isAITurn } from '../../src/games/pent-em-in/ai';

describe('Wave 46 pent — isAITurn seat', () => {
  it('true for matching seat; false for other', () => {
    const state = createInitialState();
    expect(isAITurn(state, 'player1')).toBe(true);
    expect(isAITurn(state, 'player2')).toBe(false);
  });
});
