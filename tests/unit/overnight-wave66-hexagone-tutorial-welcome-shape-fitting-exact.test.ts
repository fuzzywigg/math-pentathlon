/**
 * Wave 66 leftover after tip/#316 — Hex-a-Gone welcome shape-fitting exact.
 * Soft shape-fitting regex; lock strong title + puzzle p leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexAGoneTutorial } from '../../src/games/hex-a-gone/tutorial';

describe('Wave 66 hexagone — tutorial welcome shape fitting exact', () => {
  it('welcome strong Hex-a-Gone + shape-fitting puzzle exact', () => {
    const step = hexAGoneTutorial.steps.find((s) => s.id === 'welcome');
    expect(step?.message).toContain(
      "<p>Let's learn how to play <strong>Hex-a-Gone!</strong></p>"
    );
    expect(step?.message).toContain(
      "<p>It's a shape-fitting puzzle game where you fill up the board!</p>"
    );
  });
});
