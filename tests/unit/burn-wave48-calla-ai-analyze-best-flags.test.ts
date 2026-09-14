/**
 * Wave 48 — Calla analyzeMoves marks isBestMove on top score. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { analyzeMoves } from '../../src/games/calla/ai';

describe('Wave 48 calla — analyze best flags', () => {
  it('exactly one isBestMove; good moves near best', () => {
    const analyses = analyzeMoves(createInitialState(), 'player1');
    expect(analyses.filter((a) => a.isBestMove)).toHaveLength(1);
    expect(analyses[0].isBestMove).toBe(true);
    expect(analyses[0].isGoodMove).toBe(true);
    expect(analyses.every((a) => typeof a.reasoning === 'string')).toBe(true);
  });
});
