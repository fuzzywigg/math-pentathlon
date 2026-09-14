/**
 * Wave 58 Contig/SD residual — Contig passTurn wrong-phase identity. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/contig-60/types';
import { passTurn } from '../../src/games/contig-60/rules';

describe('Wave 58 contig — pass wrong phase', () => {
  it('returns same reference when phase is rolling', () => {
    const state = createInitialState();
    expect(passTurn(state)).toBe(state);
  });
});
