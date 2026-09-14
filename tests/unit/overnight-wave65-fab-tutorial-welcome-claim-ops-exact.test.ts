/**
 * Wave 65 leftover after tip/#305 — Fab welcome claim+ops sentence exact.
 * Soft /Claim the most/ regex; lock full welcome claim p leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fabADiffyTutorial } from '../../src/games/fab-a-diffy/tutorial';

describe('Wave 65 fab — tutorial welcome claim ops exact', () => {
  it('welcome includes claim-most operations paragraph', () => {
    const step = fabADiffyTutorial.steps.find((s) => s.id === 'welcome');
    expect(step?.message).toContain(
      '<p>Claim the most answer bars by combining fraction bars with operations!</p>'
    );
    expect(step?.message).toContain('<strong>Fab-a-Diffy</strong>');
  });
});
