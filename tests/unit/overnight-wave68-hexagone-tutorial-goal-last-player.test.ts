/**
 * Wave 68 leftover after tip/#336 — Hex-a-Gone goal last-player strong. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexAGoneTutorial } from '../../src/games/hex-a-gone/tutorial';

describe('Wave 68 hexagone — tutorial goal last player', () => {
  it('goal locks last player strong + can\'t fit shapes', () => {
    const step = hexAGoneTutorial.steps.find((s) => s.id === 'goal');
    expect(step?.message).toContain('<strong>last player who can place a shape</strong>');
    expect(step?.message).toContain("can't fit any more shapes");
    expect(step?.title).toBe('How to Win');
  });
});
