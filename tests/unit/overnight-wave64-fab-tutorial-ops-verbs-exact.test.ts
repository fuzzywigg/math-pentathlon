/**
 * Wave 64 leftover after #305 — Fab operations verb sentences exact.
 * Wave57 soft-matches Add/Subtract/Multiply/Divide; deepen exact leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fabADiffyTutorial } from '../../src/games/fab-a-diffy/tutorial';

describe('Wave 64 fab — tutorial ops verbs exact', () => {
  it('operations lists exact Add/Subtract/Multiply/Divide fraction verbs', () => {
    const step = fabADiffyTutorial.steps.find((s) => s.id === 'operations');
    expect(step?.message).toContain('Add fractions');
    expect(step?.message).toContain('Subtract fractions');
    expect(step?.message).toContain('Multiply fractions');
    expect(step?.message).toContain('Divide fractions');
  });
});
