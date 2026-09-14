/**
 * Wave 59 leftover after #276 — Kings move-history collapse + complete luck. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 59 kings — tutorial history/complete copy', () => {
  it('move-history collapse cue; complete Congratulations + Good luck', () => {
    const history = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'move-history');
    expect(history?.message).toMatch(/collapse it by clicking/);
    const complete = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'complete');
    expect(complete?.message).toMatch(/Congratulations/);
    expect(complete?.message).toMatch(/Good luck and have fun/);
  });
});
