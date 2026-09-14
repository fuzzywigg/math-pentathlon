/**
 * Wave 48 overnight — Calla analyzeMoves isGoodMove 20% band. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { analyzeMoves } from '../../src/games/calla/ai';

describe('Wave 48 calla overnight — goodmove band', () => {
  it('best is good; near-best within 20% marked good', () => {
    const analyses = analyzeMoves(createInitialState(), 'player1');
    expect(analyses[0].isBestMove).toBe(true);
    expect(analyses[0].isGoodMove).toBe(true);
    const best = analyses[0].score;
    const threshold = Math.abs(best) * 0.2;
    for (const a of analyses) {
      if (Math.abs(a.score - best) <= threshold) {
        expect(a.isGoodMove).toBe(true);
      }
    }
  });
});
