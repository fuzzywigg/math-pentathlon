/**
 * Wave 67 leftover after tip/#336 — Fab turn choose-two pool exact.
 * Wave63/65 strong labels; lock Choose two fraction bars leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fabADiffyTutorial } from '../../src/games/fab-a-diffy/tutorial';

describe('Wave 67 fab — tutorial turn choose two', () => {
  it('turn-sequence Select Bars body chooses two from pool', () => {
    const step = fabADiffyTutorial.steps.find((s) => s.id === 'turn-sequence');
    expect(step?.message).toContain(
      'Choose two fraction bars from your pool'
    );
  });
});
