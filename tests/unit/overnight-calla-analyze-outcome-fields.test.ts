/**
 * Overnight HEAVY after #214/#215 — Calla analyzeMoves outcome fields. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { analyzeMoves } from '../../src/games/calla/ai';

describe('Overnight calla — analyze outcome fields', () => {
  it('exposes score/outcome/reasoning/best flags', () => {
    const analyses = analyzeMoves(createInitialState(), 'player1');
    expect(analyses.length).toBe(5);
    for (const a of analyses) {
      expect(typeof a.pit).toBe('number');
      expect(typeof a.score).toBe('number');
      expect(a.outcome).toBeTruthy();
      expect(typeof a.reasoning).toBe('string');
      expect(typeof a.isGoodMove).toBe('boolean');
      expect(typeof a.isBestMove).toBe('boolean');
    }
    expect(analyses.some((a) => a.isBestMove)).toBe(true);
  });
});
