/**
 * Wave 67 leftover after tip/#316 — Fab winning highlight .fab-scores.
 * Wave55 bundled highlight; dedicated scores selector leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fabADiffyTutorial } from '../../src/games/fab-a-diffy/tutorial';

describe('Wave 67 fab — tutorial winning highlight scores', () => {
  it('winning highlights .fab-scores', () => {
    const step = fabADiffyTutorial.steps.find((s) => s.id === 'winning');
    expect(step?.highlightSelector).toBe('.fab-scores');
  });
});
