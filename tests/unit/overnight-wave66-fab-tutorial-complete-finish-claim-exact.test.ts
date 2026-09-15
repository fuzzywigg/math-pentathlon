/**
 * Wave 66 leftover after tip/#316 — Fab complete Finish claim strong exact.
 * Wave63 pins Now you know; deepen Finish claim sentence leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fabADiffyTutorial } from '../../src/games/fab-a-diffy/tutorial';

describe('Wave 66 fab — tutorial complete finish claim exact', () => {
  it('complete urges Finish and claim those answer bars', () => {
    const step = fabADiffyTutorial.steps.find((s) => s.id === 'complete');
    expect(step?.message).toContain(
      '<p>Click <strong>Finish</strong> and claim those answer bars!</p>'
    );
    expect(step?.position).toBe('center');
  });
});
