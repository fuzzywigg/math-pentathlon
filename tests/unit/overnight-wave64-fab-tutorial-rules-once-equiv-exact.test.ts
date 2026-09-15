/**
 * Wave 64 leftover after #305 — Fab rules once/simplify/equiv exacts.
 * Wave55 soft used-once + 2/4; deepen full rule sentence leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fabADiffyTutorial } from '../../src/games/fab-a-diffy/tutorial';

describe('Wave 64 fab — tutorial rules once equiv exact', () => {
  it('rules lock once / simplified / equivalent 2/4=1/2 sentences', () => {
    const step = fabADiffyTutorial.steps.find((s) => s.id === 'rules');
    expect(step?.message).toContain('Each fraction bar can only be used once');
    expect(step?.message).toContain('Results are automatically simplified');
    expect(step?.message).toContain(
      'Equivalent fractions match (e.g., 2/4 = 1/2)'
    );
  });
});
