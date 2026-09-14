/**
 * Wave 64 leftover after tip/#303 — Hex-a-Gone shapes colorful + Pattern Blocks. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexAGoneTutorial } from '../../src/games/hex-a-gone/tutorial';

describe('Wave 64 hexagone — tutorial shapes colorful', () => {
  it('Pattern Blocks title; colorful shapes cue', () => {
    const shapes = hexAGoneTutorial.steps.find((s) => s.id === 'shapes-intro');
    expect(shapes?.title).toBe('Pattern Blocks');
    expect(shapes?.message).toMatch(/colorful shapes/);
    expect(shapes?.message).toMatch(/Yellow Hexagons/);
    expect(shapes?.message).toMatch(/Orange Squares/);
  });
});
