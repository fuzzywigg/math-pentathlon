/**
 * Wave 67 leftover after tip/#316 — Fab operations position center.
 * Wave57 bundled position; dedicated ops center leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fabADiffyTutorial } from '../../src/games/fab-a-diffy/tutorial';

describe('Wave 67 fab — tutorial ops position', () => {
  it('operations step positions center', () => {
    const step = fabADiffyTutorial.steps.find((s) => s.id === 'operations');
    expect(step?.position).toBe('center');
  });
});
