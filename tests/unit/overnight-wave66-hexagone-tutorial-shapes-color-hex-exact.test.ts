/**
 * Wave 66 leftover after tip/#316 — Hex-a-Gone shapes color hex exact.
 * Soft Yellow/Orange names; lock #FFD700/#32CD32 leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexAGoneTutorial } from '../../src/games/hex-a-gone/tutorial';

describe('Wave 66 hexagone — tutorial shapes color hex exact', () => {
  it('shapes-intro color spans #FFD700 + #32CD32 + #4169E1 exact', () => {
    const step = hexAGoneTutorial.steps.find((s) => s.id === 'shapes-intro');
    expect(step?.message).toContain('style="color: #FFD700"');
    expect(step?.message).toContain('style="color: #32CD32"');
    expect(step?.message).toContain('style="color: #4169E1"');
    expect(step?.message).toContain('● Green Triangles');
    expect(step?.message).toContain('● Blue Rhombuses');
  });
});
