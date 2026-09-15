/**
 * Wave 64 leftover after #305 — Fab welcome claim-most sentence exact.
 * Wave55 soft-matches claim-most; deepen full operations claim leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fabADiffyTutorial } from '../../src/games/fab-a-diffy/tutorial';

describe('Wave 64 fab — tutorial welcome claim exact', () => {
  it('welcome locks full claim-most combining operations sentence', () => {
    const step = fabADiffyTutorial.steps.find((s) => s.id === 'welcome');
    expect(step?.message).toContain(
      'Claim the most answer bars by combining fraction bars with operations!'
    );
  });
});
