/**
 * Wave 59 leftover after #276 — Hex-a-Gone shapes-intro color names. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexAGoneTutorial } from '../../src/games/hex-a-gone/tutorial';

describe('Wave 59 hexagone — tutorial shapes color names', () => {
  it('shapes-intro lists Red/Blue/Green/Orange named shapes', () => {
    const shapes = hexAGoneTutorial.steps.find((s) => s.id === 'shapes-intro');
    expect(shapes?.message).toMatch(/Red Trapezoids/);
    expect(shapes?.message).toMatch(/Blue Rhombuses/);
    expect(shapes?.message).toMatch(/Green Triangles/);
    expect(shapes?.message).toMatch(/Orange Squares/);
  });
});
