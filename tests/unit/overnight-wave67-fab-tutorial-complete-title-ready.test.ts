/**
 * Wave 67 leftover after tip/#316 — Fab complete Ready title exact.
 * Wave63 title Ready; re-lock dedicated leftover after #316. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fabADiffyTutorial } from '../../src/games/fab-a-diffy/tutorial';

describe('Wave 67 fab — tutorial complete title ready', () => {
  it('complete title is Ready to Play!', () => {
    const step = fabADiffyTutorial.steps.find((s) => s.id === 'complete');
    expect(step?.title).toBe('Ready to Play!');
  });
});
