/**
 * Wave 67 leftover after tip/#316 — Fab operations title exact.
 * Wave63 bundled titles soft; lock Operations title leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fabADiffyTutorial } from '../../src/games/fab-a-diffy/tutorial';

describe('Wave 67 fab — tutorial ops title', () => {
  it('operations step title is Operations', () => {
    const step = fabADiffyTutorial.steps.find((s) => s.id === 'operations');
    expect(step?.title).toBe('Operations');
  });
});
