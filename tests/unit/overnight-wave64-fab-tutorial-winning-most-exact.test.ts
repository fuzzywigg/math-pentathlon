/**
 * Wave 64 leftover after #305 — Fab winning most-bars sentence exact.
 * Wave55 soft-matches most/all used; deepen full winning leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fabADiffyTutorial } from '../../src/games/fab-a-diffy/tutorial';

describe('Wave 64 fab — tutorial winning most exact', () => {
  it('winning locks most answer bars when all bars are used wins', () => {
    const step = fabADiffyTutorial.steps.find((s) => s.id === 'winning');
    expect(step?.message).toContain(
      'The player who claims the most answer bars when all bars are used wins!'
    );
  });
});
