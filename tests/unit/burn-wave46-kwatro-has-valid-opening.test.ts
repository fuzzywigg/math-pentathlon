/**
 * Wave 46 — Kwatro hasValidMoves opening leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, hasValidMoves, passTurn } from '../../src/games/kwatro-sinko/rules';

describe('Wave 46 kwatro — hasValid opening', () => {
  it('true for both seats at opening', () => {
    const state = createInitialState();
    expect(hasValidMoves(state)).toBe(true);
    expect(hasValidMoves(passTurn(state))).toBe(true);
  });
});
