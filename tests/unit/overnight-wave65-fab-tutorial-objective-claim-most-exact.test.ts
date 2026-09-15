/**
 * Wave 65 leftover after tip/#305 — Fab objective claim-most sentence exact.
 * Soft claim-most existed on welcome; lock objective p leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fabADiffyTutorial } from '../../src/games/fab-a-diffy/tutorial';

describe('Wave 65 fab — tutorial objective claim most exact', () => {
  it('objective restates claim-most answer bars sentence', () => {
    const step = fabADiffyTutorial.steps.find((s) => s.id === 'objective');
    expect(step?.title).toBe('Objective');
    expect(step?.message).toContain(
      '<p>Claim the most answer bars by combining fraction bars with operations!</p>'
    );
    expect(step?.position).toBe('center');
  });
});
