/**
 * Wave 64 leftover after #305 — Fab strategy plan + versatile exacts.
 * Wave63 locks Block opponent; deepen Plan combinations + Save versatile. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fabADiffyTutorial } from '../../src/games/fab-a-diffy/tutorial';

describe('Wave 64 fab — tutorial strategy plan versatile', () => {
  it('strategy-tips locks Plan combinations and Save versatile sentences', () => {
    const step = fabADiffyTutorial.steps.find((s) => s.id === 'strategy-tips');
    expect(step?.message).toContain(
      'Plan combinations that match multiple possible answers'
    );
    expect(step?.message).toContain('Save versatile fractions for later');
  });
});
