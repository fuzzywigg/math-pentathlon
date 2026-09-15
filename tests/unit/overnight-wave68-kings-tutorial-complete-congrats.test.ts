/**
 * Wave 68 leftover after tip/#336 — Kings complete Congratulations exact. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 68 kings — tutorial complete congrats', () => {
  it('complete locks Congratulations + How to Play + Finish', () => {
    const step = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'complete');
    expect(step?.message).toContain('Congratulations! You now know how to play Kings & Quadraphages!');
    expect(step?.message).toContain('How to Play');
    expect(step?.message).toContain('<strong>Finish</strong>');
  });
});
