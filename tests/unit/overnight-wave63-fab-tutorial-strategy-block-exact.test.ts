/**
 * Overnight TOKENMAXX HEAVY leftovers after #296 — Fab strategy block exact.
 * Wave54 pins title + soft plan/versatile; deepen opponent block sentence. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fabADiffyTutorial } from '../../src/games/fab-a-diffy/tutorial';

describe('Wave 63 fab — tutorial strategy block exact', () => {
  it('strategy-tips includes Block opponent potential matches', () => {
    const step = fabADiffyTutorial.steps.find((s) => s.id === 'strategy-tips');
    expect(step?.message).toContain("Block opponent's potential matches");
  });
});
