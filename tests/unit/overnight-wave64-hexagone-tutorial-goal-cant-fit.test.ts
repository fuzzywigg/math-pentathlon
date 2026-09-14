/**
 * Wave 64 leftover after tip/#303 — Hex-a-Gone goal can't-fit win copy. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexAGoneTutorial } from '../../src/games/hex-a-gone/tutorial';

describe('Wave 64 hexagone — tutorial goal cant fit', () => {
  it("When the other player can't fit; How to Win title", () => {
    const goal = hexAGoneTutorial.steps.find((s) => s.id === 'goal');
    expect(goal?.title).toBe('How to Win');
    expect(goal?.message).toMatch(/When the other player can't fit any more shapes, you win!/);
    expect(goal?.message).toMatch(/last player who can place a shape/);
  });
});
