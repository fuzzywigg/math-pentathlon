/**
 * Wave 67 leftover after tip/#336 — Fab turn pick ops symbols exact.
 * Wave65 strong Choose Operation; lock Pick +, −, ×, or ÷ leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fabADiffyTutorial } from '../../src/games/fab-a-diffy/tutorial';

describe('Wave 67 fab — tutorial turn pick ops', () => {
  it('turn-sequence Choose Operation body lists four symbols', () => {
    const step = fabADiffyTutorial.steps.find((s) => s.id === 'turn-sequence');
    expect(step?.message).toContain('Pick +, −, ×, or ÷');
  });
});
