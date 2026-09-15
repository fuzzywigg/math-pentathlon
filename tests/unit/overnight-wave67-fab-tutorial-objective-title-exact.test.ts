/**
 * Wave 67 leftover after tip/#316 — Fab objective title exact.
 * Wave65 claim-most body; lock Objective title leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fabADiffyTutorial } from '../../src/games/fab-a-diffy/tutorial';

describe('Wave 67 fab — tutorial objective title', () => {
  it('objective step title is Objective', () => {
    const step = fabADiffyTutorial.steps.find((s) => s.id === 'objective');
    expect(step?.title).toBe('Objective');
  });
});
