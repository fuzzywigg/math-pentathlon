/**
 * Wave 45 — Par 55 hasValidMoves empty-hand leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, hasValidMoves } from '../../src/games/par-55/rules';

describe('Wave 45 par — hasValidMoves', () => {
  it('false when current hand empty even if board has placements', () => {
    const state = createInitialState();
    expect(hasValidMoves(state)).toBe(true);
    expect(hasValidMoves({ ...state, hands: { ...state.hands, player1: [] } })).toBe(false);
  });
});
