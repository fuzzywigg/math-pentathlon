/**
 * Wave 64 leftover after #305 — Fab complete Finish claim exact.
 * Wave63 locks Now you know; deepen Finish strong + claim leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fabADiffyTutorial } from '../../src/games/fab-a-diffy/tutorial';

describe('Wave 64 fab — tutorial complete finish claim', () => {
  it('complete locks Finish strong and claim those answer bars', () => {
    const step = fabADiffyTutorial.steps.find((s) => s.id === 'complete');
    expect(step?.message).toContain(
      'Click <strong>Finish</strong> and claim those answer bars!'
    );
  });
});
