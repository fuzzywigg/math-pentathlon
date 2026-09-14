/**
 * Wave 64 leftover after tip/#303 — Kings your-king Player 1 exact. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 64 kings — tutorial your-king p1 exact', () => {
  it("Your King title; Player 1's King (Blue)", () => {
    const step = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'your-king');
    expect(step?.title).toBe('Your King');
    expect(step?.message).toMatch(/Player 1's King/);
    expect(step?.message).toMatch(/top center of the board/);
  });
});
