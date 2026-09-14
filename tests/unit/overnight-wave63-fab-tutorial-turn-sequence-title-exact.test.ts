/**
 * Overnight TOKENMAXX HEAVY leftovers after #296 — Fab turn-sequence title exact.
 * Wave55 soft-matches message verbs; deepen title toBe leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fabADiffyTutorial } from '../../src/games/fab-a-diffy/tutorial';

describe('Wave 63 fab — tutorial turn-sequence title exact', () => {
  it('turn-sequence title is exact Turn Sequence', () => {
    const step = fabADiffyTutorial.steps.find((s) => s.id === 'turn-sequence');
    expect(step?.title).toBe('Turn Sequence');
  });
});
