/**
 * Wave 64 leftover after tip/#303 — Kings opponent-king Player 2 exact. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 64 kings — tutorial opponent-king p2 exact', () => {
  it("Opponent's King title; Player 2's King (Red)", () => {
    const step = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'opponent-king');
    expect(step?.title).toBe("Opponent's King");
    expect(step?.message).toMatch(/Player 2's King/);
    expect(step?.message).toMatch(/bottom center/);
  });
});
