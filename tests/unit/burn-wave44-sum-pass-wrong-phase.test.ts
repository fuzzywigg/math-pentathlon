/**
 * Wave 44 — Sum Dominoes passTurn wrong-phase leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, passTurn } from '../../src/games/sum-dominoes/rules';

describe('Wave 44 Sum Dominoes — pass wrong phase', () => {
  it('identity outside passing', () => {
    const s = createInitialState();
    expect(passTurn(s)).toEqual(s);
    expect(passTurn({ ...s, phase: 'placing' })).toEqual({ ...s, phase: 'placing' });
  });
});
