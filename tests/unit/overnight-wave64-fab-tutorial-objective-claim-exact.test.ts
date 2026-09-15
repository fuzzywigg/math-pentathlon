/**
 * Wave 64 leftover after #305 — Fab objective claim-most sentence exact.
 * Wave56 soft-matches claim/combining; deepen full sentence leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fabADiffyTutorial } from '../../src/games/fab-a-diffy/tutorial';

describe('Wave 64 fab — tutorial objective claim exact', () => {
  it('objective restates exact claim-most combining operations sentence', () => {
    const step = fabADiffyTutorial.steps.find((s) => s.id === 'objective');
    expect(step?.title).toBe('Objective');
    expect(step?.message).toContain(
      'Claim the most answer bars by combining fraction bars with operations!'
    );
  });
});
