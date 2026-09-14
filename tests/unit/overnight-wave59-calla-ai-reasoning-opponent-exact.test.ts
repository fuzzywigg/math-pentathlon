/**
 * Wave 59 leftover after #279 — Calla analyzeMoves opponent-side reason exact.
 * Distinct from wave50 soft /opponent/i match. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { analyzeMoves } from '../../src/games/calla/ai';

describe('Wave 59 calla — ai reasoning opponent exact', () => {
  it('opening pit 4 reasoning is exact opponent-side copy', () => {
    const analyses = analyzeMoves(createInitialState(), 'player1');
    const pit4 = analyses.find((a) => a.pit === 4);
    expect(pit4?.outcome.landsSide).toBe('opponent');
    expect(pit4?.reasoning).toBe("Adds cubes to opponent's side.");
  });
});
