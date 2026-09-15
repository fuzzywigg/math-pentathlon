/**
 * Wave 67 leftover after tip/#336 — Fab operations − strong verb exact.
 * Wave57 soft Subtract; lock <strong>−</strong> leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fabADiffyTutorial } from '../../src/games/fab-a-diffy/tutorial';

describe('Wave 67 fab — tutorial ops subtract strong', () => {
  it('operations lists exact strong − Subtract fractions', () => {
    const step = fabADiffyTutorial.steps.find((s) => s.id === 'operations');
    expect(step?.message).toContain('<strong>−</strong> Subtract fractions');
  });
});
