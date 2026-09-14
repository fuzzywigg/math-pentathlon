/**
 * Wave 59 leftover after #279 — Calla analyzeMoves free-turn reason exact string.
 * Distinct from wave50 soft /free turn/i match. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { analyzeMoves } from '../../src/games/calla/ai';

describe('Wave 59 calla — ai reasoning free turn exact', () => {
  it('opening pit 2 reasoning is exact free-turn copy', () => {
    const analyses = analyzeMoves(createInitialState(), 'player1');
    const pit2 = analyses.find((a) => a.pit === 2);
    expect(pit2?.outcome.landsInCalla).toBe(true);
    expect(pit2?.reasoning).toBe('Lands in your Calla for a free turn!');
  });
});
