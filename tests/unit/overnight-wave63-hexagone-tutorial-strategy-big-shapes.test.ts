/**
 * Wave 63 leftover after #301 — Hex-a-Gone strategy Big shapes / smarter residuals. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexAGoneTutorial } from '../../src/games/hex-a-gone/tutorial';

describe('Wave 63 hexagone — tutorial strategy big shapes', () => {
  it('strategy-tip Big shapes hard; placing 1 smarter than 3', () => {
    const tip = hexAGoneTutorial.steps.find((s) => s.id === 'strategy-tip');
    expect(tip?.title).toBe('Strategy');
    expect(tip?.message).toMatch(/Big shapes are hard to fit later/);
    expect(tip?.message).toMatch(/Sometimes placing 1 shape is smarter than 3/);
  });
});
