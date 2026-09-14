/**
 * Wave 65 leftover after tip/#305 — Fab winning claims-most paragraph exact.
 * Soft most-when-all regex existed; lock full p leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fabADiffyTutorial } from '../../src/games/fab-a-diffy/tutorial';

describe('Wave 65 fab — tutorial winning claims most exact', () => {
  it('winning locks claims-most when all bars used paragraph', () => {
    const step = fabADiffyTutorial.steps.find((s) => s.id === 'winning');
    expect(step?.message).toContain(
      '<p>The player who claims the most answer bars when all bars are used wins!</p>'
    );
    expect(step?.position).toBe('bottom');
  });
});
