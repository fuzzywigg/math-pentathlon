/**
 * Wave 65 leftover after tip/#305 — Fab rules equivalent 2/4=1/2 exact.
 * Soft 2/4 = 1/2 regex existed; lock full li leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fabADiffyTutorial } from '../../src/games/fab-a-diffy/tutorial';

describe('Wave 65 fab — tutorial rules equivalent exact', () => {
  it('rules lists equivalent fractions 2/4 = 1/2 example', () => {
    const step = fabADiffyTutorial.steps.find((s) => s.id === 'rules');
    expect(step?.message).toContain(
      '<li>Equivalent fractions match (e.g., 2/4 = 1/2)</li>'
    );
    expect(step?.position).toBe('top');
  });
});
