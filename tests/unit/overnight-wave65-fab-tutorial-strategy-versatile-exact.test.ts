/**
 * Wave 65 leftover after tip/#305 — Fab strategy versatile fractions exact.
 * Soft /versatile fractions/ existed; lock full li leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fabADiffyTutorial } from '../../src/games/fab-a-diffy/tutorial';

describe('Wave 65 fab — tutorial strategy versatile exact', () => {
  it('strategy-tips lists save versatile fractions for later', () => {
    const step = fabADiffyTutorial.steps.find((s) => s.id === 'strategy-tips');
    expect(step?.message).toContain(
      '<li>Save versatile fractions for later</li>'
    );
  });
});
