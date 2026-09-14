/**
 * Wave 64 leftover after tip/#303 — Kings complete Congratulations + How to Play. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 64 kings — tutorial complete congrats rules', () => {
  it('Congratulations exact; review the rules via How to Play', () => {
    const complete = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'complete');
    expect(complete?.message).toMatch(/Congratulations! You now know how to play Kings & Quadraphages!/);
    expect(complete?.message).toMatch(/review the rules/);
    expect(complete?.message).toMatch(/How to Play/);
    expect(complete?.title).toBe('Tutorial Complete!');
  });
});
