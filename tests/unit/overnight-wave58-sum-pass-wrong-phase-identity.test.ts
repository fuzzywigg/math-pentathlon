/**
 * Wave 58 Contig/SD residual — Sum passTurn wrong-phase identity. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, passTurn } from '../../src/games/sum-dominoes/rules';

describe('Wave 58 sum — pass wrong phase', () => {
  it('returns same reference when rolling', () => {
    const state = createInitialState();
    expect(passTurn(state)).toBe(state);
  });
});
