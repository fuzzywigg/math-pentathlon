/**
 * Wave 66 leftover after tip/#316 — Fab operations + Add fractions strong exact.
 * Wave57 soft-matches Add fractions; deepen <strong>+</strong> li leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fabADiffyTutorial } from '../../src/games/fab-a-diffy/tutorial';

describe('Wave 66 fab — tutorial ops add strong exact', () => {
  it('operations lists Add fractions with + strong', () => {
    const step = fabADiffyTutorial.steps.find((s) => s.id === 'operations');
    expect(step?.message).toContain('<li><strong>+</strong> Add fractions</li>');
  });
});
