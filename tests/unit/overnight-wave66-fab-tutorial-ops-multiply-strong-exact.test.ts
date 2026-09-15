/**
 * Wave 66 leftover after tip/#316 — Fab operations × Multiply strong exact.
 * Soft Multiply verb existed; deepen <strong>×</strong> li leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fabADiffyTutorial } from '../../src/games/fab-a-diffy/tutorial';

describe('Wave 66 fab — tutorial ops multiply strong exact', () => {
  it('operations lists Multiply fractions with × strong', () => {
    const step = fabADiffyTutorial.steps.find((s) => s.id === 'operations');
    expect(step?.message).toContain('<li><strong>×</strong> Multiply fractions</li>');
  });
});
