/**
 * Wave 68 leftover after tip/#334 — Hex-a-Gone strategy big-shapes exact. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexAGoneTutorial } from '../../src/games/hex-a-gone/tutorial';

describe('Wave 68 hexagone — tutorial strategy big shapes', () => {
  it('strategy-tip locks Big shapes hard to fit later exact', () => {
    const step = hexAGoneTutorial.steps.find((s) => s.id === 'strategy-tip');
    expect(step?.message).toContain('Big shapes are hard to fit later!');
    expect(step?.message).toContain('Try to leave awkward spaces for your opponent');
    expect(step?.title).toBe('Strategy');
  });
});
