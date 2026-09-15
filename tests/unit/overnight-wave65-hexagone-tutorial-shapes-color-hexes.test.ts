/**
 * Wave 65 leftover after tip/#313 — Hex-a-Gone shapes yellow/red colors. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexAGoneTutorial } from '../../src/games/hex-a-gone/tutorial';

describe('Wave 65 hexagone — tutorial shapes color hexes', () => {
  it('Yellow #FFD700 + Red #FF4444', () => {
    const step = hexAGoneTutorial.steps.find((s) => s.id === 'shapes-intro');
    expect(step?.message).toContain('color: #FFD700');
    expect(step?.message).toContain('color: #FF4444');
  });
});
