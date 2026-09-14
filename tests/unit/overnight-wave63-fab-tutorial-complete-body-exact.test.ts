/**
 * Overnight TOKENMAXX HEAVY leftovers after #296 — Fab complete body exact.
 * Wave54 soft Finish/claim; deepen Now you know sentence leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fabADiffyTutorial } from '../../src/games/fab-a-diffy/tutorial';

describe('Wave 63 fab — tutorial complete body exact', () => {
  it('complete says Now you know how to play Fab-a-Diffy', () => {
    const step = fabADiffyTutorial.steps.find((s) => s.id === 'complete');
    expect(step?.message).toContain('Now you know how to play Fab-a-Diffy!');
  });
});
