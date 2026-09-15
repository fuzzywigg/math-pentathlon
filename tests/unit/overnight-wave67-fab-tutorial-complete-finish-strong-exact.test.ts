/**
 * Wave 67 leftover after tip/#336 — Fab complete Finish strong exact.
 * Wave63 Now-you-know body; lock Click <strong>Finish</strong> leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fabADiffyTutorial } from '../../src/games/fab-a-diffy/tutorial';

describe('Wave 67 fab — tutorial complete finish strong', () => {
  it('complete uses exact Finish strong claim CTA', () => {
    const step = fabADiffyTutorial.steps.find((s) => s.id === 'complete');
    expect(step?.message).toContain(
      'Click <strong>Finish</strong> and claim those answer bars!'
    );
  });
});
