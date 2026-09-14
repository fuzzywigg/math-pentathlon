/**
 * Overnight TOKENMAXX HEAVY leftovers after #296 — Fab complete title exact.
 * Wave54 toMatch Ready to Play; deepen exact Ready to Play! leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fabADiffyTutorial } from '../../src/games/fab-a-diffy/tutorial';

describe('Wave 63 fab — tutorial complete title exact', () => {
  it('complete title is exact Ready to Play!', () => {
    const step = fabADiffyTutorial.steps.find((s) => s.id === 'complete');
    expect(step?.title).toBe('Ready to Play!');
  });
});
