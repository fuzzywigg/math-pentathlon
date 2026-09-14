/**
 * Overnight TOKENMAXX HEAVY leftovers after #296 — Fab ops/rules/winning titles exact.
 * Soft message coverage exists; deepen title toBe leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fabADiffyTutorial } from '../../src/games/fab-a-diffy/tutorial';

describe('Wave 63 fab — tutorial ops rules winning titles', () => {
  it('operations / rules / winning titles are exact', () => {
    expect(
      fabADiffyTutorial.steps.find((s) => s.id === 'operations')?.title
    ).toBe('Operations');
    expect(fabADiffyTutorial.steps.find((s) => s.id === 'rules')?.title).toBe(
      'Rules'
    );
    expect(fabADiffyTutorial.steps.find((s) => s.id === 'winning')?.title).toBe(
      'Winning'
    );
  });
});
