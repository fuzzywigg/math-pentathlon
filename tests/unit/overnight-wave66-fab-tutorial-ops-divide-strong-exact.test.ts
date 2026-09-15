/**
 * Wave 66 leftover after tip/#316 — Fab operations ÷ Divide strong exact.
 * Soft Divide verb existed; deepen <strong>÷</strong> li leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fabADiffyTutorial } from '../../src/games/fab-a-diffy/tutorial';

describe('Wave 66 fab — tutorial ops divide strong exact', () => {
  it('operations lists Divide fractions with ÷ strong', () => {
    const step = fabADiffyTutorial.steps.find((s) => s.id === 'operations');
    expect(step?.message).toContain('<li><strong>÷</strong> Divide fractions</li>');
  });
});
