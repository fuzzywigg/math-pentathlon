/**
 * Wave 67 leftover after tip/#336 — Fab turn claim-it match exact.
 * Wave65 Match Answer strong; lock claim it! sentence leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fabADiffyTutorial } from '../../src/games/fab-a-diffy/tutorial';

describe('Wave 67 fab — tutorial turn claim it', () => {
  it('turn-sequence Match Answer body claims available answer', () => {
    const step = fabADiffyTutorial.steps.find((s) => s.id === 'turn-sequence');
    expect(step?.message).toContain(
      'If the result matches an available answer bar, claim it!'
    );
  });
});
