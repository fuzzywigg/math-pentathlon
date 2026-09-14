/**
 * Wave 65 leftover after tip/#305 — Fab strategy plan-combinations exact.
 * Soft /Plan combinations/ existed; lock full li leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fabADiffyTutorial } from '../../src/games/fab-a-diffy/tutorial';

describe('Wave 65 fab — tutorial strategy plan combinations exact', () => {
  it('strategy-tips lists plan combinations matching multiple answers', () => {
    const step = fabADiffyTutorial.steps.find((s) => s.id === 'strategy-tips');
    expect(step?.message).toContain(
      '<li>Plan combinations that match multiple possible answers</li>'
    );
  });
});
